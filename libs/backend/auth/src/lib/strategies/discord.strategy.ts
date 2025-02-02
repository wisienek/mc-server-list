import {type Profile, Strategy} from 'passport-discord';
import {Inject, Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {AES} from 'crypto-js';
import {ApiConfig, DiscordConfig} from '@backend/config';
import type {Done, IAuthService} from '../interfaces';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: IAuthService,
        private readonly appConfig: ApiConfig,
        private readonly discordConfig: DiscordConfig,
    ) {
        super({
            clientID: discordConfig.DISCORD_CLIENT_ID,
            clientSecret: discordConfig.DISCORD_CLIENT_SECRET,
            callbackURL: discordConfig.DISCORD_REDIRECT_URI,
            scope: ['identify', 'email', 'guilds'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Done,
    ) {
        const encryptedAccessToken = this.encrypt(accessToken);
        const encryptedRefreshToken = this.encrypt(refreshToken);

        const {id: discordId, email, discriminator, username, avatar} = profile;

        const user = await this.authService.validateUser({
            discordId,
            email,
            discordTag: `${username}#${discriminator}`,
            avatar,
        });

        await this.authService.validateOAuth2({
            discordId,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        });

        done(null, user);
    }

    private encrypt(token: string): string {
        return AES.encrypt(token, this.appConfig.COOKIE_SECRET).toString();
    }

    private decrypt(token: string): string {
        return AES.decrypt(token, this.appConfig.COOKIE_SECRET).toString();
    }
}
