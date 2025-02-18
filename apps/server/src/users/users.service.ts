import {DiscordOAuth2Credentials, User, UserCredentials} from '@backend/db';
import {InjectRepository} from '@nestjs/typeorm';
import type {Request} from 'express';
import {IsNull, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {SaveUserCredentialsDto} from '@shared/dto';
import {FindOptionsRelations} from 'typeorm/find-options/FindOptionsRelations';
import {UserNotFoundError} from './errors';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(DiscordOAuth2Credentials)
        private readonly authTokensRepository: Repository<DiscordOAuth2Credentials>,
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>,
    ) {}

    public async getUserByEmail(
        email: string,
        relations: FindOptionsRelations<User> = {votes: true, servers: true},
    ): Promise<User> {
        return await this.usersRepository.findOne({where: {email}, relations});
    }

    public async logout(request: Request) {
        return request.session.destroy(() => {
            return true;
        });
    }

    public async isFirstLogin(discordId: string): Promise<boolean> {
        const hasEverLoggedIn = await this.authTokensRepository.exists({
            where: {discordId},
        });
        const noPasswordSet = await this.usersRepository.exists({
            where: {
                credentials: {
                    password: IsNull(),
                },
            },
            relations: {
                credentials: true,
            },
        });

        return noPasswordSet && hasEverLoggedIn;
    }

    public async saveCredentials(
        email: string,
        data: SaveUserCredentialsDto,
    ): Promise<void> {
        const user = await this.usersRepository.findOne({where: {email}});
        if (!user) {
            throw new UserNotFoundError();
        }

        const userCredentials =
            (await this.userCredentialsRepository.findOne({
                where: {user: {email: email}},
                relations: {user: true},
            })) ?? this.userCredentialsRepository.create({user});

        userCredentials.password = await this.hashPassword(data.password);

        await this.userCredentialsRepository.save(userCredentials);
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    /**
     * Check if password is correct
     * @param {string} originalPassword - password that is stored in database
     * @param {string} checkingPassword - User provided password
     * @returns {Promise<boolean>}
     * @private
     */
    private async checkPassword(
        originalPassword: string,
        checkingPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(checkingPassword, originalPassword);
    }
}
