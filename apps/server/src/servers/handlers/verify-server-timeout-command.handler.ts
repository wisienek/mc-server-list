import {GetServerStatsQuery, VerifyTimeoutsCommand} from '@backend/commander';
import {ApiConfig} from '@backend/config';
import {Server} from '@backend/db';
import {RedisToken} from '@backend/redis';
import {CommandHandler, type ICommandHandler, QueryBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
} from '@shared/dto';
import {plainToInstance} from 'class-transformer';
import type {Redis} from 'ioredis';
import {Repository} from 'typeorm';
import {Inject, Logger} from '@nestjs/common';
import type {GetServerStatsQueryHandlerReturnType} from './mc-server-stats.handler';

@CommandHandler(VerifyTimeoutsCommand)
export class VerifyTimeoutsCommandHandler
    implements ICommandHandler<VerifyTimeoutsCommand>
{
    private readonly logger = new Logger(VerifyTimeoutsCommandHandler.name);

    constructor(
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        private readonly apiConfig: ApiConfig,
        private readonly queryBus: QueryBus,
        @Inject(RedisToken) private readonly redisService: Redis,
    ) {}

    async execute(command: VerifyTimeoutsCommand): Promise<Server | void> {
        const isHostName = !!command.hostName;

        return isHostName
            ? this.verifyServer(command.hostName)
            : this.verifyManyServers();
    }

    private async verifyServer(hostName: string): Promise<Server> {
        this.logger.log(`Will re-verify timed out server ${hostName}`);
        const server = await this.serverRepository.findOne({
            where: {
                host: hostName,
            },
        });

        if (!server) {
            this.logger.warn(
                `No server with hostname: ${hostName} found for re-verification for timeout!`,
            );
            return null;
        }

        const address = `${server.host ? server.host : server.ip_address}${
            server.port ? `:${server.port}` : ''
        }`;

        let stats: MinecraftServerOfflineStatus | MinecraftServerOnlineStatus;

        try {
            const data = await this.queryBus.execute<
                GetServerStatsQuery,
                GetServerStatsQueryHandlerReturnType
            >(
                plainToInstance(GetServerStatsQuery, {
                    type: server.type,
                    host: address,
                }),
            );

            stats = data.stats;
        } catch (error) {
            this.logger.warn(`Error while getting server info:`, error);
            return null;
        }

        const isServerActive = await this.processServerStatus(server, stats);
        this.logger.log(
            `Server re-verified for timeout; ${
                server.isTimedOut
            } -> ${!isServerActive}`,
        );

        return server;
    }

    private async verifyManyServers(): Promise<void> {
        let offset = 0;
        let hasMore = true;

        this.logger.log(`Starting timeout verification...`);

        while (hasMore) {
            const servers = await this.serverRepository
                .createQueryBuilder('server')
                .limit(this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_BATCH)
                .offset(offset)
                .getMany();

            this.logger.log(
                `Fetched ${servers.length} servers that will be verified`,
            );

            if (servers.length === 0) {
                hasMore = false;
                break;
            }

            offset += this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_BATCH;

            const results = await Promise.allSettled(
                servers.map(async (server) => {
                    const address = `${
                        server.host ? server.host : server.ip_address
                    }${server.port ? `:${server.port}` : ''}`;

                    try {
                        const {stats} = await this.queryBus.execute<
                            GetServerStatsQuery,
                            GetServerStatsQueryHandlerReturnType
                        >(
                            plainToInstance(GetServerStatsQuery, {
                                type: server.type,
                                host: address,
                            }),
                        );

                        return {server, stats};
                    } catch (error) {
                        this.logger.error(
                            `Failed to fetch stats for server ${server.id}: ${error.message}`,
                        );
                        return {server};
                    }
                }),
            );

            const updates: Promise<boolean>[] = results.map(
                (
                    result: PromiseFulfilledResult<GetServerStatsQueryHandlerReturnType>,
                ) =>
                    this.processServerStatus(
                        result.value.server,
                        result.value.stats,
                    ),
            );

            await Promise.all(updates);
        }

        this.logger.log(`Completed timeout verification process.`);
    }

    /**
     * Processes the results of status query
     * @param server
     * @param stats
     * @returns {boolean} true if online and not timed out
     * @private
     */
    private async processServerStatus(
        server: Server,
        stats?: GetServerStatsQueryHandlerReturnType['stats'],
    ): Promise<boolean> {
        const offlineCountKey = `server:offlineCount:${server.id}`;
        let offlineCount = (await this.redisService.get(offlineCountKey)) || 0;
        offlineCount = Number(offlineCount);

        if (stats && stats instanceof MinecraftServerOnlineStatus) {
            await this.redisService.del(offlineCountKey);
            if (server.isTimedOut) {
                await this.serverRepository.update(server.id, {
                    isTimedOut: false,
                });
            }

            this.logger.log(
                `Server ${server.host} - ${
                    offlineCount > 0
                        ? `Has been ${offlineCount} times offline, now online - resetting count.`
                        : 'still online'
                } `,
            );
            return true;
        }

        offlineCount++;

        if (offlineCount >= this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_TIMES) {
            await this.serverRepository.update(server.id, {
                isTimedOut: true,
            });
            await this.redisService.del(offlineCountKey);

            this.logger.warn(
                `Server ${server.host} - ${offlineCount} times offline, setting timed out info!`,
            );

            return false;
        }

        this.logger.warn(
            `Server ${server.host} - has been offline for ${offlineCount} / ${this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_TIMES} times.`,
        );

        await this.redisService.set(
            offlineCountKey,
            offlineCount,
            'EX',
            7 * 24 * 60 * 60,
        );
        return false;
    }
}
