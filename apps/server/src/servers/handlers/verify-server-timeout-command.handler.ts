import {GetServerStatsQuery, VerifyTimeoutsCommand} from '@backend/commander';
import {ApiConfig} from '@backend/config';
import {Server} from '@backend/db';
import {RedisToken} from '@backend/redis';
import {CommandHandler, type ICommandHandler, QueryBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {MinecraftServerOnlineStatus} from '@shared/dto';
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

    async execute(): Promise<void> {
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const servers = await this.serverRepository
                .createQueryBuilder('server')
                .where('server.isActive = :active', {active: true})
                .limit(this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_BATCH)
                .offset(offset)
                .getMany();

            if (servers.length === 0) {
                hasMore = false;
                break;
            }

            offset += this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_BATCH;

            const results = await Promise.allSettled(
                servers.map(async (server) => {
                    const address = server.ip_address || server.host;

                    try {
                        const {stats}: GetServerStatsQueryHandlerReturnType =
                            await this.queryBus.execute(
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
                        return null;
                    }
                }),
            );

            const updates: Promise<void>[] = results
                .filter((result) => result.status === 'fulfilled' && result.value)
                .map(
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

    private async processServerStatus(
        server: Server,
        stats: GetServerStatsQueryHandlerReturnType['stats'],
    ): Promise<void> {
        const offlineCountKey = `server:offlineCount:${server.id}`;
        let offlineCount = (await this.redisService.get(offlineCountKey)) || 0;
        offlineCount = Number(offlineCount);

        if (stats instanceof MinecraftServerOnlineStatus) {
            await this.redisService.del(offlineCountKey);
            await this.serverRepository.update(server.id, {
                isTimedOut: false,
            });
        } else {
            offlineCount++;

            if (offlineCount >= this.apiConfig.AUTOMATIC_SERVER_TIMEOUT_TIMES) {
                await this.serverRepository.update(server.id, {
                    isTimedOut: true,
                });
                await this.redisService.del(offlineCountKey);
            } else {
                await this.redisService.set(
                    offlineCountKey,
                    offlineCount,
                    'EX',
                    7 * 24 * 60 * 60,
                );
            }
        }
    }
}
