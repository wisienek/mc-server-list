import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {AuthenticatedGuard, SessionUser} from '@backend/auth';
import {VerifyServerCommand} from '@backend/commander';
import {CommandBus} from '@nestjs/cqrs';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {User} from '@backend/db';
import {seconds, SkipThrottle, Throttle} from '@nestjs/throttler';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    Pagination,
    ServerDetailsDto,
    ServerSummaryDto,
    UpdateServerDetailsDto,
    VerifyServerDto,
} from '@shared/dto';
import {
    ServerAlreadyClaimedError,
    ServerExistsError,
    ServerNotFoundError,
    ServerVerificationOfflineError,
    ServerVerificationUnsuccessfulError,
} from './errors';
import {ServersService} from './servers.service';

@Controller('servers')
export class ServersController {
    constructor(
        private readonly serversService: ServersService,
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly commandBus: CommandBus,
    ) {}

    /**
     * For static generation
     * @returns {Promise<void>}
     */
    @SkipThrottle()
    @Get('hostnames')
    async listHostnames(): Promise<string[]> {
        return await this.serversService.listHostnames();
    }

    /**
     * Public endpoint for getting list of servers
     * @returns {Promise<Pagination<ServerSummaryDto>>} paginated list of servers
     */
    @SkipThrottle()
    @Get()
    async listServers(
        @SessionUser() user: User,
        @Query() data: ListServersDto,
    ): Promise<Pagination<ServerSummaryDto>> {
        return await this.serversService.listServers(data, user?.id);
    }

    @ApiConflictResponse({
        type: ServerAlreadyClaimedError,
        description: `When server already exists in database as someones else`,
    })
    @ApiConflictResponse({
        type: ServerExistsError,
        description: `When server already exists in database and is owned by user`,
    })
    @UseGuards(AuthenticatedGuard)
    @Post()
    async createServer(
        @Body() createServerDto: CreateServerDto,
    ): Promise<CreateServerResponseDto> {
        return await this.serversService.createServer(createServerDto);
    }

    @ApiParam({
        name: 'host',
        required: true,
        description: 'hostname of the server',
    })
    @Get(':host')
    async getServer(
        @SessionUser() user: User,
        @Param('host') host: string,
    ): Promise<ServerDetailsDto> {
        return await this.serversService.getServer(host, user?.id);
    }

    @ApiParam({
        name: 'host',
        required: true,
        description: 'hostname of the server',
    })
    @ApiBadRequestResponse({
        type: ServerVerificationOfflineError,
        description: `When server is currently offline`,
    })
    @ApiBadRequestResponse({
        type: ServerVerificationUnsuccessfulError,
        description: `When server verification is unsuccessful - no code in motd, code expired or is already activated.`,
    })
    @ApiNotFoundResponse({
        type: ServerNotFoundError,
        description: `When server couldn't be found by ip or hostname`,
    })
    @Throttle({
        default: {
            limit: 1,
            ttl: seconds(60),
            getTracker: (req) => req.user?.id || req.ip,
        },
    })
    @UseGuards(AuthenticatedGuard)
    @Patch(':host/verify')
    async verifyServer(
        @SessionUser() user: User,
        @Body() data: VerifyServerDto,
    ): Promise<ServerSummaryDto> {
        await this.commandBus.execute(
            new VerifyServerCommand(data.hostname, user.id),
        );

        return await this.serversService.getServer(data.hostname);
    }

    @ApiParam({
        name: 'host',
        required: true,
        description: 'hostname of the server',
    })
    @UseGuards(AuthenticatedGuard)
    @Patch(':host/details')
    async createDetails(
        @SessionUser() user: User,
        @Param('host') host: string,
        @Body() data: UpdateServerDetailsDto,
    ): Promise<ServerDetailsDto> {
        return this.serversService.updateServerDetails(host, user.id, data);
    }

    @ApiParam({
        name: 'host',
        required: true,
        description: 'hostname of the server',
    })
    @ApiOkResponse({
        description: 'Deleted!',
    })
    @ApiNotFoundResponse({
        type: ServerNotFoundError,
        description: `When server couldn't be found by hostname`,
    })
    @UseGuards(AuthenticatedGuard)
    @Delete(':host')
    async deleteServer(@SessionUser() user: User, @Param('host') host: string) {
        await this.serversService.deleteServer(host);
    }

    @ApiParam({
        name: 'host',
        required: true,
        description: 'hostname of the server',
    })
    @UseGuards(AuthenticatedGuard)
    @Post(':host/vote')
    async vote(
        @SessionUser() user: User,
        @Param('host') host: string,
    ): Promise<number> {
        return await this.serversService.voteForServer(host, user.email);
    }
}
