import {
    Body,
    Controller,
    Delete,
    Get,
    NotImplementedException,
    Patch,
    Post,
} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {
    CreateServerDto,
    CreateServerResponseDto,
    VerifyServerDto,
} from '@shared/dto';
import {ServersService} from './servers.service';

@ApiTags('Servers')
@Controller('servers')
export class ServersController {
    constructor(private serversService: ServersService) {}

    @Get()
    async listServers() {
        throw new NotImplementedException();
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
