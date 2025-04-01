import {SerializedResult, serializeResult} from '@core';
import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
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

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly usersService: UsersService,
    ) {}

    @Get('discord/redirect')
    @UseGuards(DiscordAuthGuard)
    redirect() {
        return {msg: 'Redirect'};
    }

    @Get('login')
    @UseGuards(DiscordAuthGuard)
    login() {
        return {msg: 'Login'};
    }

    @UseGuards(LoginGuard)
    @Post('login/credentials')
    loginWithCredentials(@SessionUser() user: User): SerializedResult<UserDto> {
        return serializeResult(Ok(this.mapper.map(user, User, UserDto)));
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    status(@SessionUser() user: User): SerializedResult<UserDto> {
        return serializeResult(Ok(this.mapper.map(user, User, UserDto)));
    }

    @Get('has-credentials')
    @UseGuards(AuthenticatedGuard)
    async hasCredentials(
        @SessionUser() user: User,
    ): Promise<SerializedResult<boolean>> {
        return serializeResult(await this.usersService.isFirstLogin(user.discordId));
    }

    @Post('save-credentials')
    async setCredentials(
        @SessionUser() user: User,
        @Body() data: SaveUserCredentialsDto,
    ): Promise<SerializedResult<void>> {
        return serializeResult(
            await this.usersService.saveCredentials(user.email, data),
        );
    }

    @Post('logout')
    async logout(@Req() request: Request): Promise<any> {
        return this.usersService.logout(request);
    }
}
