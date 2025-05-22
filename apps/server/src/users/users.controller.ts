import {SerializedResult, serializeResult} from '@core';
import {Body, Controller, Get, Inject, Post, Req, UseGuards} from '@nestjs/common';
import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {ApiTags} from '@nestjs/swagger';
import {type Request} from 'express';
import {Ok} from 'oxide.ts';
import {
    AuthenticatedGuard,
    DiscordAuthGuard,
    LoginGuard,
    SessionUser,
} from '@backend/auth';
import {User} from '@backend/db';
import {SaveUserCredentialsDto, UserDto} from '@shared/dto';
import {UsersService} from './users.service';
import {Logger} from '@nestjs/common';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly usersService: UsersService,
        @Inject(Logger) private readonly logger: Logger,
    ) {}

    @Get('discord/redirect')
    @UseGuards(DiscordAuthGuard)
    redirect() {
        this.logger.log('Redirecting user to Discord OAuth');
        return {msg: 'Redirect'};
    }

    @Get('login')
    @UseGuards(DiscordAuthGuard)
    login() {
        this.logger.log('Login initiated with Discord OAuth');
        return {msg: 'Login'};
    }

    @UseGuards(LoginGuard)
    @Post('login/credentials')
    loginWithCredentials(@SessionUser() user: User): SerializedResult<UserDto> {
        this.logger.log('User logged in with credentials', {
            discordId: user.discordId,
        });
        return serializeResult(Ok(this.mapper.map(user, User, UserDto)));
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    status(@SessionUser() user: User): SerializedResult<UserDto> {
        this.logger.debug('Fetching user session status', {
            discordId: user.discordId,
        });
        return serializeResult(Ok(this.mapper.map(user, User, UserDto)));
    }

    @Get('has-credentials')
    @UseGuards(AuthenticatedGuard)
    async hasCredentials(
        @SessionUser() user: User,
    ): Promise<SerializedResult<boolean>> {
        this.logger.debug('Checking if user has saved credentials', {
            discordId: user.discordId,
        });
        return serializeResult(await this.usersService.isFirstLogin(user.discordId));
    }

    @Post('save-credentials')
    async setCredentials(
        @SessionUser() user: User,
        @Body() data: SaveUserCredentialsDto,
    ): Promise<SerializedResult<void>> {
        this.logger.log('Saving user credentials', {
            email: user.email,
            discordId: user.discordId,
        });
        return serializeResult(
            await this.usersService.saveCredentials(user.email, data),
        );
    }

    @Post('logout')
    async logout(@Req() request: Request): Promise<SerializedResult<boolean>> {
        this.logger.log('User requested logout', {
            sessionId: request.session?.id,
            discordId: (request as any)?.user?.discordId,
        });
        return serializeResult(await this.usersService.logout(request));
    }
}
