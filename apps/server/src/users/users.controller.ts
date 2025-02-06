import {AuthenticatedGuard, DiscordAuthGuard} from '@backend/auth';
import {Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import type {Request} from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
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
    status(@Req() req: Request) {
        return req.user;
    }

    @Post('logout')
    logout() {
        return {};
    }
}
