import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {ApiTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    NotImplementedException,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    Pagination,
    ServerDto,
    VerifyServerDto,
} from '@shared/dto';
import {ServersService} from './servers.service';

@ApiTags('Servers')
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

    @Post()
    async createServer(
        @Body() createServerDto: CreateServerDto,
    ): Promise<CreateServerResponseDto> {
        return await this.serversService.createServer(
            createServerDto,
            'test@gmail.com',
        );
    }

    @Patch(':host')
    async verifyServer(@Body() data: VerifyServerDto) {
        await this.serversService.verifyServer(data);
    }

    @Patch(':host/details')
    async createDetails() {
        throw new NotImplementedException();
    }

    @Delete(':host')
    async deleteServer() {
        throw new NotImplementedException();
    }
}
