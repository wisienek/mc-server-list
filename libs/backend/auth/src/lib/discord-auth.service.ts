import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {DiscordOAuth2Credentials, User} from '@backend/db';
import type {
    FindOAuth2Params,
    FindUserParams,
    IAuthService,
    OAuth2Details,
    UserDetails,
} from './interfaces';

@Injectable()
export class DiscordAuthService implements IAuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(DiscordOAuth2Credentials)
        private readonly oauth2Repository: Repository<DiscordOAuth2Credentials>,
    ) {}

    public async validateUser(details: UserDetails): Promise<User> {
        const {discordId} = details;
        const user = await this.findUser({discordId});
        return user ? this.updateUser(user, details) : this.createUser(details);
    }

    public async createUser(details: UserDetails): Promise<User> {
        const user = this.userRepository.create({
            email: details.email,
            discordTag: details.discordTag,
            discordId: details.discordId,
            avatar: details.avatar,
            username: details.username,
        });
        return this.userRepository.save(user);
    }

    public async updateUser(user: User, details: UserDetails): Promise<User> {
        user.avatar = details.avatar;
        user.discordTag = details.discordId;
        user.discordId = details.discordId;

        await this.userRepository.save(user);
        return user;
    }

    public findUser(params: FindUserParams): Promise<User | null> {
        return this.userRepository.findOne({where: params});
    }

    public async validateOAuth2(details: OAuth2Details) {
        const {discordId} = details;
        const oauth2 = await this.findOAuth2({discordId});
        return oauth2 ? this.updateOAuth2(details) : this.createOAuth2(details);
    }

    public createOAuth2(details: OAuth2Details): Promise<DiscordOAuth2Credentials> {
        const user = this.oauth2Repository.create(details);
        return this.oauth2Repository.save(user);
    }

    public async updateOAuth2(details: OAuth2Details): Promise<OAuth2Details> {
        await this.oauth2Repository.update(details.discordId, details);
        return details;
    }

    public async findOAuth2(
        params: FindOAuth2Params,
    ): Promise<DiscordOAuth2Credentials | null> {
        return this.oauth2Repository.findOne({where: params});
    }
}
