import {type FindOptionsWhere, Repository} from 'typeorm';
import {plainToInstance} from 'class-transformer';
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {
    BedrockServer,
    JavaServer,
    Server,
    ServerRanking,
    ServerVerification,
    Vote,
} from '@backend/db';
import {
    CreateServerVerificationCommand,
    GetServerStatsQuery,
    GetUserQuery,
} from '@backend/commander';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    Pagination,
    ServerDetailsDto,
    ServerSummaryDto,
    UpdateServerDetailsDto,
} from '@shared/dto';
import type {GetServerStatsQueryHandlerReturnType} from './handlers';
import {
    ServerExistsError,
    ServerNotFoundError,
    ServerNotOwnedByUserError,
    ServerVerificationOfflineError,
} from './errors';

@Injectable()
export class ServersService {
    constructor(
        @InjectRepository(JavaServer)
        private readonly javaServerRepository: Repository<JavaServer>,
        @InjectRepository(BedrockServer)
        private readonly bedrockServerRepository: Repository<BedrockServer>,
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        @InjectRepository(Vote)
        private readonly voteRepository: Repository<Vote>,
        private readonly logger: Logger,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    public async voteForServer(
        hostName: string,
        userEmail: string,
    ): Promise<number> {
        const server = await this.serverRepository.findOne({
            where: {host: hostName},
        });

        const givenVote = await this.voteRepository.findOne({
            where: {
                server: {
                    host: hostName,
                },
                user: {
                    email: userEmail,
                },
            },
        });

        if (!givenVote) {
            const user = await this.queryBus.execute(
                plainToInstance(GetUserQuery, {email: userEmail}),
            );

            await this.voteRepository.save({
                server,
                user,
            });
        } else {
            await this.voteRepository.remove(givenVote);
        }

        return await this.voteRepository.count({where: {server: {host: hostName}}});
    }

    public async updateServerDetails(
        host: string,
        userId: string,
        updateData: UpdateServerDetailsDto,
    ): Promise<ServerDetailsDto> {
        const server = await this.serverRepository.findOne({where: {host}});

        if (!server) {
            throw new ServerNotFoundError(host);
        }

        if (server.owner_id !== userId) {
            throw new ServerNotOwnedByUserError(host, userId);
        }

        Object.assign(server, updateData);

        const updatedServer = await this.serverRepository.save(server);

        return this.mapper.map(updatedServer, Server, ServerDetailsDto);
    }

    public async listHostnames(): Promise<string[]> {
        return (await this.serverRepository.find({select: ['host']})).map(
            (i) => i.host,
        );
    }

    public async listServers(
        filters: ListServersDto,
        userId?: string,
    ): Promise<Pagination<ServerSummaryDto>> {
        const query = this.serverRepository
            .createQueryBuilder('server')
            .leftJoinAndMapOne(
                'server.rankingData',
                ServerRanking,
                'sr',
                'sr.serverId = server.id',
            );

        if (filters.isActive !== undefined) {
            query.where('server.isActive = :active', {active: filters.isActive});
        }

        if (filters.q) {
            const searchTerm = `%${filters.q}%`;
            query.andWhere(
                `(server.description ILIKE :searchTerm
            OR server.name ILIKE :searchTerm
            OR server.ip_address ILIKE :searchTerm
            OR server.host ILIKE :searchTerm
            OR CAST(server.port AS TEXT) ILIKE :searchTerm
            OR CAST(server.motd AS TEXT) ILIKE :searchTerm)`,
                {searchTerm},
            );
        }

        if (filters.online !== undefined) {
            query.andWhere('server.online = :online', {online: filters.online});
        }

        if (filters.eula_blocked !== undefined) {
            query.andWhere('server.eula_blocked = :eula_blocked', {
                eula_blocked: filters.eula_blocked,
            });
        }

        if (filters.versions?.length) {
            query.andWhere('server.versions && ARRAY[:...versions]', {
                versions: filters.versions,
            });
        }

        if (filters.isOwn === true && userId) {
            query.andWhere('server.owner_id = :owner', {owner: userId});
        }

        if (filters.categories?.length) {
            query.andWhere(
                'server.categories && ARRAY[:...categories]::server_categories_enum[]',
                {categories: filters.categories},
            );
        }

        query.orderBy('sr.ranking', 'ASC');

        const page = filters.page || 1;
        const perPage = filters.perPage || 10;
        query.skip((page - 1) * perPage).take(perPage);

        const [items, total] = await query.getManyAndCount();

        const mapped = await Promise.all(
            items.map(async (item) => {
                const dto = this.mapper.map(item, Server, ServerSummaryDto);
                const {votesCount, ranking} = await this.getVotesAndRankingForServer(
                    item,
                );

                dto.isLiked = userId
                    ? await this.voteRepository.exists({
                          where: {server_id: item.id, user_id: userId},
                      })
                    : false;
                dto.votes = votesCount;
                dto.ranking = ranking;

                if (userId) {
                    const verification: ServerVerification =
                        await this.commandBus.execute(
                            new CreateServerVerificationCommand(item.id, userId),
                        );

                    dto.verificationCode = verification.code;
                }

                return dto;
            }),
        );

        return new Pagination<ServerSummaryDto>(mapped, total, perPage, page);
    }

    public async getServer(
        hostName: string,
        userId?: string,
    ): Promise<ServerDetailsDto> {
        const baseServer = await this.serverRepository.findOne({
            where: {host: hostName},
            relations: {
                owner: true,
            },
        });
        const {votesCount, ranking} = await this.getVotesAndRankingForServer(
            baseServer,
        );

        const dto = this.mapper.map(baseServer, Server, ServerDetailsDto);
        dto.votes = votesCount;
        dto.ranking = ranking;
        dto.isLiked =
            userId &&
            (await this.voteRepository.exists({
                where: {server_id: baseServer.id, user_id: userId},
            }));
        dto.isOwner = baseServer.owner_id === userId;
        if (userId) {
            const verification: ServerVerification = await this.commandBus.execute(
                new CreateServerVerificationCommand(baseServer.id, userId),
            );

            dto.verificationCode = verification.code;
        }

        return dto;
    }

    public async createServer(
        data: CreateServerDto,
    ): Promise<CreateServerResponseDto> {
        const existsServer = await this.getServerByHostNameOrIP(data);

        if (existsServer) {
            throw new ServerExistsError(
                existsServer.verifications?.find((v) => v.verified)?.code,
            );
        }

        const fetchedServer: GetServerStatsQueryHandlerReturnType =
            await this.queryBus.execute(
                plainToInstance(GetServerStatsQuery, {
                    type: data.type,
                    host: data.hostname,
                }),
            );

        if (!fetchedServer.server) {
            throw new ServerVerificationOfflineError();
        }

        const server = await this.serverRepository.save(fetchedServer.server);

        const verification = await this.commandBus.execute(
            new CreateServerVerificationCommand(server.id, server.owner_id),
        );

        this.logger.log(
            `Created server: ${server.host} for ${server.type} with verification: ${verification.code}`,
        );

        return {
            ...verification,
            host: server.host,
        };
    }

    /**
     * Deletes a server by its host name.
     * @param host The hostname of the server to delete.
     * @throws ServerNotFoundError if no matching server is found.
     */
    public async deleteServer(host: string): Promise<void> {
        const server = await this.getServerByHostNameOrIP({hostname: host});

        if (!server) {
            throw new ServerNotFoundError(host);
        }

        if (server instanceof JavaServer) {
            await this.javaServerRepository.remove(server);
        } else if (server instanceof BedrockServer) {
            await this.bedrockServerRepository.remove(server);
        } else {
            throw new Error('Unknown server type encountered during deletion.');
        }
    }

    private async getVotesAndRankingForServer(
        server: Server,
    ): Promise<{votesCount: number; ranking: number}> {
        const votesCount = await this.voteRepository.count({
            where: {server_id: server.id},
        });

        const ranking =
            server?.rankingData?.ranking ??
            (
                await this.serverRepository.findOne({
                    where: {id: server.id},
                    relations: {rankingData: true},
                })
            ).rankingData.ranking;

        return {
            votesCount,
            ranking,
        };
    }

    /**
     * Retrieves a server (either JavaServer or BedrockServer) by hostname, port, or IP.
     * @param data Object containing optional hostname, port, and ip properties.
     * @returns The found Server entity or null if not found.
     */
    private async getServerByHostNameOrIP(data: {
        hostname?: string;
        port?: number;
        ip?: string;
    }): Promise<Server> {
        const searchData: FindOptionsWhere<Server> = {};

        if (data.ip) {
            searchData.ip_address = data.ip;
        }
        if (data.port) {
            searchData.port = data.port;
        }
        if (data.hostname) {
            searchData.host = data.hostname;
        }

        return await this.serverRepository.findOne({
            where: searchData,
            relations: {verifications: true, owner: true},
        });
    }
}
