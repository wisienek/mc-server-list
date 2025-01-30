import {Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ServerFilterDto} from '@shared/dto';
import {ServersService} from './servers.service';

@ApiTags('Servers')
@Controller('servers')
export class ServersController {
    constructor(private serversService: ServersService) {}

    @Get()
    async listServers(@Query() query: ServerFilterDto) {
        return;
    }

    @Get(':host')
    async getServer() {
        return;
    }

    @Post()
    async createServer() {
        return;
    }

    @Patch(':host')
    async verifyServer() {
        return;
    }

    @Patch(':host/details')
    async createDetails() {
        return;
    }

    @Delete(':host')
    async deleteServer() {
        return;
    }
}
