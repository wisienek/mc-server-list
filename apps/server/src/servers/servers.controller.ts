import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
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
} from '@nestjs/common';
import {Server} from '@backend/db';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    Pagination,
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
     * Public endpoint for getting list of servers
     * @returns {Promise<Pagination<ServerDto>>} paginated list of servers
     */
    @Get()
    async listServers(
        @Query() data: ListServersDto,
    ): Promise<Pagination<ServerDto>> {
        return await this.serversService.listServers(data);
    }

    @Get(':host')
    async getServer() {
        throw new NotImplementedException();
    }

    @ApiConflictResponse({
        type: ServerAlreadyClaimedError,
        description: `When server already exists in database as someones else`,
    })
    @ApiConflictResponse({
        type: ServerExistsError,
        description: `When server already exists in database and is owned by user`,
    })
    @Post()
    async createServer(
        @Body() createServerDto: CreateServerDto,
    ): Promise<CreateServerResponseDto> {
        return await this.serversService.createServer(
            createServerDto,
            'test@gmail.com',
        );
    }

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
    @Patch(':host')
    async verifyServer(@Body() data: VerifyServerDto): Promise<ServerDto> {
        return this.mapper.map(
            await this.serversService.verifyServer(data),
            Server,
            ServerDto,
        );
    }

    @Patch(':host/details')
    async createDetails() {
        throw new NotImplementedException();
    }

    @ApiOkResponse({
        description: 'Deleted!',
    })
    @ApiNotFoundResponse({
        type: ServerNotFoundError,
        description: `When server couldn't be found by hostname`,
    })
    @Delete(':host')
    async deleteServer(@Param('host') host: string) {
        await this.serversService.deleteServer(host);
    }
}
