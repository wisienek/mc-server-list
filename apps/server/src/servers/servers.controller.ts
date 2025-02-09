import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {AuthenticatedGuard, SessionUser} from '@backend/auth';
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
    ServerDto,
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
     * @returns {Promise<Pagination<ServerDto>>} paginated list of servers
     */
    @Get()
    async listServers(
        @Query() data: ListServersDto,
    ): Promise<Pagination<ServerDto>> {
        return await this.serversService.listServers(data);
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
        @SessionUser() user: User,
        @Body() createServerDto: CreateServerDto,
    ): Promise<CreateServerResponseDto> {
        return await this.serversService.createServer(createServerDto, user.email);
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
    @Patch(':host')
    async verifyServer(
        @SessionUser() user: User,
        @Param('host') host: string,
        @Body() data: VerifyServerDto,
    ): Promise<ServerDto> {
        return this.mapper.map(
            await this.serversService.verifyServer(data),
            Server,
            ServerDto,
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
    ): Promise<boolean> {
        throw new NotImplementedException();
    }
}
