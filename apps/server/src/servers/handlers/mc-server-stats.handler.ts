import type {Mapper} from '@automapper/core';
import {InjectMapper} from '@automapper/nestjs';
import {type IQueryHandler, QueryHandler, CommandBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
} from '@shared/dto';
import {ServerType} from '@shared/enums';
import {Repository} from 'typeorm';
import {BedrockServer, JavaServer, Server} from '@backend/db';
import {
    GetServerStatsQuery,
    CreateServerVerificationCommand,
} from '@backend/commander';
import {MCStatsService} from '@backend/mc-stats';

export type GetServerStatsQueryHandlerReturnType = {
    server: Server;
    stats: MinecraftServerOfflineStatus | MinecraftServerOnlineStatus;
};

@QueryHandler(GetServerStatsQuery)
export class GetServerStatsQueryHandler
    implements IQueryHandler<GetServerStatsQuery>
{
    constructor(
        private readonly mcStatsService: MCStatsService,
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        private readonly commandBus: CommandBus,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    async execute(
        query: GetServerStatsQuery,
    ): Promise<GetServerStatsQueryHandlerReturnType> {
        const stats = await this.mcStatsService.fetchServerInfo(
            query.host,
            query.type === ServerType.BEDROCK,
        );
        let server: Server;

        if (stats instanceof MinecraftServerOnlineStatus) {
            server = await this.updateServer(stats, query.type);
        }

        return {stats, server};
    }

    private async updateServer(
        data: MinecraftServerOnlineStatus,
        type: ServerType,
    ): Promise<Server> {
        const found = await this.serverRepository
            .createQueryBuilder('server')
            .where({ip_address: data.ip, port: data.port})
            .orWhere({host: data.hostname})
            .getOne();

        let mappedData: JavaServer | BedrockServer;
        if (type === ServerType.BEDROCK) {
            mappedData = this.mapper.map(
                data,
                MinecraftServerOnlineStatus,
                BedrockServer,
            );
        } else if (type === ServerType.JAVA) {
            mappedData = this.mapper.map(
                data,
                MinecraftServerOnlineStatus,
                JavaServer,
            );
        }

        if (!found) {
            const server = await this.serverRepository.save(
                {
                    ...mappedData,
                },
                {reload: true},
            );

            await this.commandBus.execute(
                new CreateServerVerificationCommand(server.id, server.owner_id),
            );

            return server;
        }

        return await this.serverRepository.save({
            ...found,
            ...mappedData,
        });
    }
}
