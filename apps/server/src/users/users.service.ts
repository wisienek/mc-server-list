import {DiscordOAuth2Credentials, User, UserCredentials} from '@backend/db';
import {Errors, TError} from '@core';
import {InjectRepository} from '@nestjs/typeorm';
import type {Request} from 'express';
import {IsNull, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {SaveUserCredentialsDto} from '@shared/dto';
import {FindOptionsRelations} from 'typeorm/find-options/FindOptionsRelations';
import {Result, Ok, Err} from 'oxide.ts';

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
    ): Promise<Result<User, TError>> {
        const user = await this.usersRepository.findOne({where: {email}, relations});
        if (!user) {
            return Err(Errors.UserNotFound());
        }

        return Ok(user);
    }

    public async logout(request: Request): Promise<Result<true, TError>> {
        return new Promise((resolve) => {
            request.session.destroy(() => {
                resolve(Ok(true));
            });
        });
    }

    public async isFirstLogin(discordId: string): Promise<Result<boolean, TError>> {
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

        return Ok(noPasswordSet && hasEverLoggedIn);
    }

    public async saveCredentials(
        email: string,
        data: SaveUserCredentialsDto,
    ): Promise<Result<void, TError>> {
        const user = await this.usersRepository.findOne({where: {email}});
        if (!user) {
            return Err(Errors.UserNotFound());
        }

        const userCredentials =
            (await this.userCredentialsRepository.findOne({
                where: {user: {email}},
                relations: {user: true},
            })) ?? this.userCredentialsRepository.create({user});

        userCredentials.password = await this.hashPassword(data.password);
        await this.userCredentialsRepository.save(userCredentials);

        return Ok(undefined);
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
