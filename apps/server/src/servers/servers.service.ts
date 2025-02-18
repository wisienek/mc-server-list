import type {Mapper} from '@automapper/core';
import {InjectMapper} from '@automapper/nestjs';
import {GetServerStatsQuery, GetUserQuery} from '@backend/commander';
import {BedrockServer, JavaServer, Server, ServerRanking, Vote} from '@backend/db';
import {Injectable, Logger} from '@nestjs/common';
import {QueryBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    Pagination,
    ServerSummaryDto,
} from '@shared/dto';
import {ServerType} from '@shared/enums';
import {plainToInstance} from 'class-transformer';
import {type FindOptionsWhere, Repository} from 'typeorm';
import {
    ServerExistsError,
    ServerNotFoundError,
    ServerVerificationOfflineError,
} from './errors';
import type {GetServerStatsQueryHandlerReturnType} from './handlers';

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
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    public async voteForServer(
        hostName: string,
        userEmail: string,
    ): Promise<number> {
        const server = await this.getServer(hostName);

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
            .leftJoinAndSelect('server.verification', 'verification');

        if (filters.isActive !== undefined) {
            query.where('server.isActive = :active', {active: filters.isActive});
        }

        if (filters.q && filters.q.length > 0) {
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

        if (filters.versions && filters.versions.length > 0) {
            query.andWhere('server.versions && ARRAY[:...versions]', {
                versions: filters.versions,
            });
        }

        if (filters?.isOwn === true && userId) {
            query.andWhere('server.owner_id = :owner', {owner: userId});
        }

        if (filters.categories && filters.categories.length > 0) {
            query.andWhere(
                'server.categories && ARRAY[:...categories]::server_categories_enum[]',
                {categories: filters.categories},
            );
        }

        query.leftJoinAndMapOne(
            'server.rankingData',
            ServerRanking,
            'sr',
            'sr.serverId = server.id',
        );
        query.orderBy('sr.ranking', 'ASC');

        const page = filters.page || 1;
        const perPage = filters.perPage || 10;
        query.skip((page - 1) * perPage).take(perPage);

        const [items, total] = await query.getManyAndCount();

        const mapped = await Promise.all(
            items.map(async (item) => {
                const dto = this.mapper.map(item, Server, ServerSummaryDto);
                const votesCount = await this.voteRepository.count({
                    where: {server_id: item.id},
                });
                dto.isLiked =
                    userId &&
                    (await this.voteRepository.exists({
                        where: {server_id: item.id, user_id: userId},
                    }));
                dto.votes = votesCount;
                dto.ranking = item.rankingData
                    ? item.rankingData.ranking
                    : undefined;
                return dto;
            }),
        );

        return new Pagination<ServerSummaryDto>(mapped, total, perPage, page);
    }

    public async getServer(hostName: string): Promise<Server> {
        const baseServer = await this.serverRepository.findOne({
            where: {host: hostName},
        });

        switch (baseServer.type) {
            case ServerType.JAVA: {
                return await this.javaServerRepository.findOne({
                    where: {host: baseServer.host},
                });
            }

            case ServerType.BEDROCK: {
                return await this.bedrockServerRepository.findOne({
                    where: {host: baseServer.host},
                });
            }
        }
    }

    public async createServer(
        data: CreateServerDto,
    ): Promise<CreateServerResponseDto> {
        const existsServer = await this.getServerByHostNameOrIP(data);

        if (existsServer) {
            throw new ServerExistsError(
                existsServer.verification.verified
                    ? existsServer.verification.code
                    : undefined,
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

        this.logger.log(
            `Created server: ${fetchedServer.server.host} for ${fetchedServer.server.type} and verification: ${fetchedServer.server.verification.code}`,
        );

        return {
            ...fetchedServer.server.verification,
            host: fetchedServer.server.host,
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
        const searchData: FindOptionsWhere<JavaServer | BedrockServer> = {};

        if (data.ip) {
            searchData.ip_address = data.ip;
        }
        if (data.port) {
            searchData.port = data.port;
        }
        if (data.hostname) {
            searchData.host = data.hostname;
        }

        return (
            (await this.javaServerRepository.findOne({
                where: searchData,
                relations: {verification: true, owner: true},
            })) ??
            (await this.bedrockServerRepository.findOne({
                where: searchData,
                relations: {verification: true, owner: true},
            }))
        );
    }
}
