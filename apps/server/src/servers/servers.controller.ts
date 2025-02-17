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
    NotImplementedException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {Server, User} from '@backend/db';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    Pagination,
    ServerDetailsDto,
    ServerSummaryDto,
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
    @Get('hostnames')
    async listHostnames(): Promise<string[]> {
        return await this.serversService.listHostnames();
    }

    /**
     * Public endpoint for getting list of servers
     * @returns {Promise<Pagination<ServerSummaryDto>>} paginated list of servers
     */
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
    async getServer(@Param('host') host: string): Promise<ServerDetailsDto> {
        const server = await this.serversService.getServer(host);
        return this.mapper.map(server, Server, ServerDetailsDto);
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
    @UseGuards(AuthenticatedGuard)
    @Patch(':host/verify')
    async verifyServer(@Body() data: VerifyServerDto): Promise<ServerSummaryDto> {
        await this.commandBus.execute(new VerifyServerCommand(data.hostname));

        return this.mapper.map(
            await this.serversService.getServer(data.hostname),
            Server,
            ServerSummaryDto,
        );
    }

    @ApiParam({
        name: 'host',
        required: true,
        description: 'hostname of the server',
    })
    @UseGuards(AuthenticatedGuard)
    @Patch(':host/details')
    async createDetails(@SessionUser() user: User, @Param('host') host: string) {
        throw new NotImplementedException();
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
