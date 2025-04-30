import {User, UserCredentials, DiscordOAuth2Credentials} from '@backend/db';
import {Injectable, UnauthorizedException, Inject, Logger} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {InjectRepository} from '@nestjs/typeorm';
import {Strategy} from 'passport-local';
import {Repository} from 'typeorm';
import {compare} from 'bcrypt';
import axios from 'axios';
import {DiscordAuthService} from '../discord-auth.service';
import {DiscordConfig} from '@backend/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>,
        @InjectRepository(DiscordOAuth2Credentials)
        private readonly discordCredsRepo: Repository<DiscordOAuth2Credentials>,
        @Inject('AUTH_SERVICE')
        private readonly authService: DiscordAuthService,
        private readonly config: DiscordConfig,
    ) {
        super({usernameField: 'email', passwordField: 'password'});
    }

    async validate(email: string, password: string): Promise<User> {
        const credentials = await this.userCredentialsRepository.findOne({
            where: {user: {email}},
            relations: {user: true},
        });

        const passwordMatching = await compare(
            password,
            credentials?.password ?? '',
        );

        if (!credentials?.user || !passwordMatching) {
            throw new UnauthorizedException();
        }

        const user = credentials.user;

        if (user.discordId) {
            const creds = await this.discordCredsRepo.findOne({
                where: {discordId: user.discordId},
            });

            if (creds?.accessToken) {
                try {
                    const discordUser = await this.fetchDiscordUser(
                        creds.accessToken,
                    );
                    await this.authService.updateUser(user, {
                        discordId: discordUser.id,
                        email: discordUser.email,
                        avatar: discordUser.avatar,
                        username: discordUser.username,
                        discordTag: `${discordUser.username}#${discordUser.discriminator}`,
                    });
                } catch (err) {
                    // @ts-ignore
                    this.logger.warn(`Access token failed: ${err?.message}`);
                    try {
                        const refreshed = await this.refreshToken(
                            creds.refreshToken,
                        );
                        creds.accessToken = refreshed.access_token;
                        creds.refreshToken = refreshed.refresh_token;
                        await this.discordCredsRepo.save(creds);

                        const discordUser = await this.fetchDiscordUser(
                            refreshed.access_token,
                        );
                        await this.authService.updateUser(user, {
                            discordId: discordUser.id,
                            email: discordUser.email,
                            avatar: discordUser.avatar,
                            username: discordUser.username,
                            discordTag: `${discordUser.username}#${discordUser.discriminator}`,
                        });
                    } catch (refreshErr) {
                        this.logger.warn(
                            `Token refresh failed: ${
                                (refreshErr as any)?.message ?? 'no message'
                            }`,
                        );
                    }
                }
            }
        }

        return user;
    }

    private async fetchDiscordUser(accessToken: string) {
        const {data} = await axios.get('https://discord.com/api/oauth2/@me', {
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return data;
    }

    private async refreshToken(refreshToken: string) {
        const tokenUrl = 'https://discord.com/api/oauth2/token';
        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });

        const {data} = await axios.post(tokenUrl, body.toString(), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            auth: {
                username: this.config.DISCORD_CLIENT_ID,
                password: this.config.DISCORD_CLIENT_SECRET,
            },
        });

        return data;
    }
}
