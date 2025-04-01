import {AuthenticatedGuard, SessionUser} from '@backend/auth';
import {VerifyServerCommand} from '@backend/commander';
import {serializeResult, SerializedResult} from '@core';
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
import {ServersService} from './servers.service';

@Controller('servers')
export class ServersController {
    constructor(
        private readonly serversService: ServersService,
        private readonly commandBus: CommandBus,
    ) {}

    @SkipThrottle()
    @Get('hostnames')
    async listHostnames(): Promise<SerializedResult<string[]>> {
        return serializeResult(await this.serversService.listHostnames());
    }

    @SkipThrottle()
    @Get()
    async listServers(
        @SessionUser() user: User,
        @Query() data: ListServersDto,
    ): Promise<SerializedResult<Pagination<ServerSummaryDto>>> {
        return serializeResult(
            await this.serversService.listServers(data, user?.id),
        );
    }

    @ApiConflictResponse({description: `When server already exists in database`})
    @UseGuards(AuthenticatedGuard)
    @Post()
    async createServer(
        @Body() createServerDto: CreateServerDto,
    ): Promise<SerializedResult<CreateServerResponseDto>> {
        return serializeResult(
            await this.serversService.createServer(createServerDto),
        );
    }

    @ApiParam({name: 'host', required: true, description: 'hostname of the server'})
    @Get(':host')
    async getServer(
        @SessionUser() user: User,
        @Param('host') host: string,
    ): Promise<SerializedResult<ServerDetailsDto>> {
        return serializeResult(await this.serversService.getServer(host, user?.id));
    }

    @ApiParam({name: 'host', required: true, description: 'hostname of the server'})
    @ApiBadRequestResponse({
        description: `When server is offline or verification fails.`,
    })
    @ApiNotFoundResponse({description: `When server couldn't be found`})
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
    ): Promise<SerializedResult<ServerSummaryDto>> {
        await this.commandBus.execute(
            new VerifyServerCommand(data.hostname, user.id),
        );

        return serializeResult(
            await this.serversService.getServer(data.hostname, user.id),
        );
    }

    @ApiParam({name: 'host', required: true, description: 'hostname of the server'})
    @UseGuards(AuthenticatedGuard)
    @Patch(':host/details')
    async createDetails(
        @SessionUser() user: User,
        @Param('host') host: string,
        @Body() data: UpdateServerDetailsDto,
    ): Promise<SerializedResult<ServerDetailsDto>> {
        return serializeResult(
            await this.serversService.updateServerDetails(host, user.id, data),
        );
    }

    @ApiParam({name: 'host', required: true, description: 'hostname of the server'})
    @ApiOkResponse({description: 'Deleted!'})
    @ApiNotFoundResponse({description: `When server couldn't be found`})
    @UseGuards(AuthenticatedGuard)
    @Delete(':host')
    async deleteServer(
        @Param('host') host: string,
    ): Promise<SerializedResult<void>> {
        return serializeResult(await this.serversService.deleteServer(host));
    }

    @ApiParam({name: 'host', required: true, description: 'hostname of the server'})
    @UseGuards(AuthenticatedGuard)
    @Post(':host/vote')
    async vote(
        @SessionUser() user: User,
        @Param('host') host: string,
    ): Promise<SerializedResult<Number>> {
        return serializeResult(
            await this.serversService.voteForServer(host, user.email),
        );
    }
}
