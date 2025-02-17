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
import {randomInt} from 'crypto';
import {BedrockServer, JavaServer, Server, ServerVerification} from '@backend/db';
import {GetServerStatsQuery} from '@backend/commander';
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
        @InjectRepository(ServerVerification)
        private readonly verificationRepository: Repository<ServerVerification>,
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
            return await this.serverRepository.save(
                {
                    ...mappedData,
                    verification: this.verificationRepository.create({
                        code: this.generateRandomString(16),
                    }),
                },
                {reload: true},
            );
        }

        return await this.serverRepository.save({
            ...found,
            ...mappedData,
        });
    }

    /**
     * Generates a random string.
     *
     * @param length - The desired length of the string (default is 32).
     * @returns A random string of the specified length using printable ASCII characters.
     */
    private generateRandomString(length: number = 32): string {
        const allowedChars = Array.from({length: 95}, (_, i) =>
            String.fromCharCode(i + 32),
        ).join('');
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = randomInt(0, allowedChars.length);
            result += allowedChars[randomIndex];
        }

        return result.replace(/\s/, '');
    }
}
