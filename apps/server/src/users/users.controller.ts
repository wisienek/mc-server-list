import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {ApiTags} from '@nestjs/swagger';
import {AuthenticatedGuard, DiscordAuthGuard, SessionUser} from '@backend/auth';
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

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    status(@SessionUser() user: User): UserDto {
        return this.mapper.map(user, User, UserDto);
    }

    @Get('has-credentials')
    @UseGuards(AuthenticatedGuard)
    hasCredentials(@SessionUser() user: User): Promise<boolean> {
        return this.usersService.isFirstLogin(user.discordId);
    }

    @Post('save-credentials')
    async setCredentials(
        @SessionUser() user: User,
        @Body() data: SaveUserCredentialsDto,
    ): Promise<void> {
        return this.usersService.saveCredentials(user.email, data);
    }

    @Post('logout')
    logout() {
        return {};
    }
}
