import {Errors, TError} from '@core';
import {type FindOptionsWhere, Repository} from 'typeorm';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {plainToInstance} from 'class-transformer';
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {Err, Ok, Result} from 'oxide.ts';
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
    VerifyTimeoutsCommand,
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
import type {GetServerStatsQueryHandlerReturnType} from '@api/src/servers/handlers';

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
    ): Promise<Result<number, TError>> {
        const server = await this.serverRepository.findOne({
            where: {host: hostName},
        });
        if (!server) {
            return Err(Errors.ServerNotFound(hostName));
        }

        const givenVote = await this.voteRepository.findOne({
            where: {
                server: {host: hostName},
                user: {email: userEmail},
            },
        });

        if (!givenVote) {
            const user = await this.queryBus.execute(
                plainToInstance(GetUserQuery, {email: userEmail}),
            );
            await this.voteRepository.save({server, user});
        } else {
            await this.voteRepository.remove(givenVote);
        }

        const count = await this.voteRepository.count({
            where: {server: {host: hostName}},
        });
        return Ok(count);
    }

    public async reVerifyTimeout(
        hostName: string,
    ): Promise<Result<ServerDetailsDto, TError>> {
        const server = await this.getServerByHostNameOrIP({hostname: hostName});
        if (!server) {
            return Err(Errors.ServerNotFound(hostName));
        }
        if (!server.isTimedOut) {
            return Ok(this.mapper.map(server, Server, ServerDetailsDto));
        }

        await this.commandBus.execute<VerifyTimeoutsCommand, Server>(
            new VerifyTimeoutsCommand(hostName),
        );

        const dto = this.mapper.map(
            await this.getServerByHostNameOrIP({hostname: hostName}),
            Server,
            ServerDetailsDto,
        );
        return Ok(dto);
    }

    public async updateServerDetails(
        host: string,
        userId: string,
        updateData: UpdateServerDetailsDto,
    ): Promise<Result<ServerDetailsDto, TError>> {
        const server = await this.serverRepository.findOne({where: {host}});
        if (!server) {
            return Err(Errors.ServerNotFound(host));
        }
        if (server.owner_id !== userId) {
            return Err(Errors.ServerNotOwnedByUser(host, userId));
        }

        Object.assign(server, updateData);
        const updatedServer = await this.serverRepository.save(server);
        const dto = this.mapper.map(updatedServer, Server, ServerDetailsDto);
        return Ok(dto);
    }

    public async listHostnames(): Promise<Result<string[], TError>> {
        const items = await this.serverRepository.find({select: ['host']});
        return Ok(items.map((i) => i.host));
    }

    public async listServers(
        filters: ListServersDto,
        userId?: string,
    ): Promise<Result<Pagination<ServerSummaryDto>, TError>> {
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

                if (Array.isArray(dto.description)) {
                    dto.description = dto.description.join(' ');
                }

                dto.isLiked = userId
                    ? await this.voteRepository.exists({
                          where: {server_id: item.id, user_id: userId},
                      })
                    : false;
                dto.votes = votesCount;
                dto.ranking = ranking;

                if (userId) {
                    const verification = await this.commandBus.execute<
                        CreateServerVerificationCommand,
                        ServerVerification
                    >(new CreateServerVerificationCommand(item.id, userId));

                    dto.verificationCode = verification.code;
                }

                return dto;
            }),
        );

        return Ok(new Pagination<ServerSummaryDto>(mapped, total, perPage, page));
    }

    public async getServer(
        hostName: string,
        userId?: string,
    ): Promise<Result<ServerDetailsDto, TError>> {
        const [host, port] = hostName.split(':');

        const whereOptions: FindOptionsWhere<Server> = {host};

        port && (whereOptions.port = Number(port));

        const baseServer = await this.serverRepository.findOne({
            where: whereOptions,
            relations: {owner: true},
        });

        if (!baseServer) {
            return Err(Errors.ServerNotFound(hostName));
        }

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
            const verification = await this.commandBus.execute<
                CreateServerVerificationCommand,
                ServerVerification
            >(new CreateServerVerificationCommand(baseServer.id, userId));
            dto.verificationCode = verification.code;
        }

        return Ok(dto);
    }

    public async createServer(
        data: CreateServerDto,
        userId?: string,
    ): Promise<Result<CreateServerResponseDto, TError>> {
        const existsServer = await this.getServerByHostNameOrIP(data);

        if (existsServer) {
            return Err(
                Errors.ServerExists(
                    existsServer.verifications?.find((v) => v.user_id === userId)
                        ?.code,
                ),
            );
        }

        const fetchedServer = await this.queryBus.execute<
            GetServerStatsQuery,
            GetServerStatsQueryHandlerReturnType
        >(
            plainToInstance(GetServerStatsQuery, {
                type: data.type,
                host: `${data.hostname}${
                    data?.port ? `:${data.port}` : ''
                }`.toLowerCase(),
            }),
        );

        if (!fetchedServer.server) {
            return Err(Errors.ServerVerificationOffline());
        }

        const server = await this.serverRepository.save(fetchedServer.server);

        this.logger.log(
            `Created server: ${server.host}:${server.port} for ${server.type}`,
        );

        return Ok({
            host: server.host,
        });
    }

    public async deleteServer(host: string): Promise<Result<void, TError>> {
        const server = await this.getServerByHostNameOrIP({hostname: host});

        if (!server) {
            return Err(Errors.ServerNotFound(host));
        }

        if (server instanceof JavaServer) {
            await this.javaServerRepository.remove(server);
        } else if (server instanceof BedrockServer) {
            await this.bedrockServerRepository.remove(server);
        } else {
            return Err(Errors.ServerNotFound(host));
        }

        return Ok(undefined);
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

        return {votesCount, ranking};
    }

    private async getServerByHostNameOrIP(data: {
        hostname?: string;
        port?: number;
        ip?: string;
    }): Promise<Server | null> {
        const searchData: FindOptionsWhere<Server> = {};
        if (data.ip) searchData.ip_address = data.ip;
        if (data.port) searchData.port = data.port;
        if (data.hostname) searchData.host = data.hostname;

        return await this.serverRepository.findOne({
            where: searchData,
            relations: {verifications: true, owner: true},
        });
    }
}
