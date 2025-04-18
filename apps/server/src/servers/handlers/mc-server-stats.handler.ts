import type {Mapper} from '@automapper/core';
import {InjectMapper} from '@automapper/nestjs';
import {type IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
} from '@shared/dto';
import {ServerType} from '@shared/enums';
import {Repository} from 'typeorm';
import {BedrockServer, JavaServer, Server} from '@backend/db';
import {GetServerStatsQuery} from '@backend/commander';
import {MCStatsService} from '@backend/mc-stats';
import {Logger} from '@nestjs/common';
import {omit} from 'lodash';

export type GetServerStatsQueryHandlerReturnType = {
    server: Server;
    stats: MinecraftServerOfflineStatus | MinecraftServerOnlineStatus;
};

@QueryHandler(GetServerStatsQuery)
export class GetServerStatsQueryHandler
    implements IQueryHandler<GetServerStatsQuery>
{
    private readonly logger = new Logger(GetServerStatsQueryHandler.name);

    constructor(
        private readonly mcStatsService: MCStatsService,
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
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

        this.logger.log(
            `Fetched server info for ${query.host} of type ${
                query.type
            } with return type of ${
                stats instanceof MinecraftServerOnlineStatus ? 'Online' : 'Offline'
            } status: ${JSON.stringify(
                omit(stats, 'icon', 'motd', 'players', 'mods', 'version', 'plugins'),
            )}`,
        );

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
            .orWhere({host: data.hostname, port: data.port})
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
            return await this.serverRepository.save(
                {
                    ...mappedData,
                },
                {reload: true},
            );
        }

        return await this.serverRepository.save({
            ...found,
            ...mappedData,
        });
    }
}
