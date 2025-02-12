import type {Mapper} from '@automapper/core';
import {InjectMapper} from '@automapper/nestjs';
import {GetUserQuery} from '@backend/commander';
import {
    BedrockServer,
    JavaServer,
    Server,
    ServerRanking,
    ServerVerification,
    User,
    Vote,
} from '@backend/db';
import {MCStatsService} from '@backend/mc-stats';
import {Injectable, Logger} from '@nestjs/common';
import {QueryBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
    Pagination,
    ServerSummaryDto,
    VerifyServerDto,
} from '@shared/dto';
import {ServerType} from '@shared/enums';
import {plainToInstance} from 'class-transformer';
import {randomInt} from 'crypto';
import {type FindOptionsWhere, Repository} from 'typeorm';
import {
    ServerAlreadyClaimedError,
    ServerExistsError,
    ServerNotFoundError,
    ServerVerificationOfflineError,
    ServerVerificationUnsuccessfulError,
} from './errors';

@Injectable()
export class ServersService {
    constructor(
        @InjectRepository(JavaServer)
        private readonly javaServerRepository: Repository<JavaServer>,
        @InjectRepository(BedrockServer)
        private readonly bedrockServerRepository: Repository<BedrockServer>,
        @InjectRepository(ServerVerification)
        private readonly verificationRepository: Repository<ServerVerification>,
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        @InjectRepository(Vote)
        private readonly voteRepository: Repository<Vote>,
        private readonly logger: Logger,
        private readonly mcStatsService: MCStatsService,
        private readonly queryBus: QueryBus,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    public async voteForServer(
        hostName: string,
        userEmail: string,
    ): Promise<number> {
        const server = await this.getServer(hostName);

        if (server.isActive) {
            const givenVote = await this.voteRepository.findOne({
                where: {
                    server: {
                        isActive: true,
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
        const query = this.serverRepository.createQueryBuilder('server');

        if (userId) {
            query.leftJoinAndSelect('server.verification', 'verification');
            query.where('(server.isActive = :active OR server.owner_id = :userId)', {
                active: true,
                userId,
            });
        } else {
            query.where('server.isActive = :active', {active: true});
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
        userEmail: string,
    ): Promise<CreateServerResponseDto> {
        const existsServer = await this.getServerByHostNameOrIP(data);

        if (existsServer && existsServer.owner.email !== userEmail) {
            this.logger.warn(
                `User ${userEmail} tried to claim server ${data.hostname}:${
                    data.port ?? '...'
                } for it's own, when it's claimed by: ${existsServer.owner.email}`,
            );
            throw new ServerAlreadyClaimedError();
        }

        if (existsServer) {
            throw new ServerExistsError(
                existsServer.verification.verified
                    ? existsServer.verification.code
                    : undefined,
            );
        }

        const user = await this.queryBus.execute(
            plainToInstance(GetUserQuery, {email: userEmail}),
        );

        const isBedrock = data.type === ServerType.BEDROCK;

        const fetchedServer = await this.mcStatsService.fetchServerInfo(
            `${data.hostname}:${data.port}`,
            isBedrock,
        );

        if (fetchedServer instanceof MinecraftServerOfflineStatus) {
            throw new ServerVerificationOfflineError();
        }

        const verification = this.verificationRepository.create({
            code: this.generateRandomString(16),
            expiresAt: Date.now() + 1_000 * 60 * 60 * 4, // 4hr
        });

        let createdServer: Server;
        if (isBedrock) {
            createdServer = await this.createOrUpdateBedrockServer(
                fetchedServer,
                user,
                verification,
            );
        } else {
            createdServer = await this.createOrUpdateJavaServer(
                fetchedServer,
                user,
                verification,
            );
        }

        await this.verificationRepository.save({
            ...verification,
            server: createdServer,
        });

        this.logger.log(
            `Created server: ${createdServer.host} for ${createdServer.type} and verification: ${verification.code} for user: ${userEmail}`,
        );

        return {...verification, host: createdServer.host};
    }

    public async verifyServer(data: VerifyServerDto): Promise<Server> {
        const server = await this.getServerByHostNameOrIP(data);
        if (!server) {
            throw new ServerNotFoundError(data.hostname, data.port, data.ip);
        }

        const fetchInfo = await this.mcStatsService.fetchServerInfo(
            `${server.host}:${server.port}`,
            data.type === ServerType.BEDROCK,
        );

        if (fetchInfo instanceof MinecraftServerOfflineStatus) {
            throw new ServerVerificationOfflineError();
        }

        const includesCode = fetchInfo.motd.clean
            .join(' ')
            .toLowerCase()
            .includes(server.verification.code.toLowerCase());
        const isVerified = includesCode && !server.isActive;

        if (!isVerified) {
            throw new ServerVerificationUnsuccessfulError();
        }

        server.isActive = true;

        if (server instanceof JavaServer) {
            await this.javaServerRepository.save(server);
            return await this.createOrUpdateJavaServer(
                fetchInfo,
                server.owner,
                server.verification,
            );
        } else if (server instanceof BedrockServer) {
            await this.bedrockServerRepository.save(server);
            return await this.createOrUpdateBedrockServer(
                fetchInfo,
                server.owner,
                server.verification,
            );
        } else {
            throw new Error('Unknown server type encountered during deletion.');
        }
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

    private async createOrUpdateJavaServer(
        data: MinecraftServerOnlineStatus,
        user: User,
        verification: ServerVerification,
    ): Promise<JavaServer> {
        const found = await this.javaServerRepository
            .createQueryBuilder('server')
            .where({ip_address: data.ip, port: data.port})
            .orWhere({host: data.hostname})
            .getOne();

        const mappedData = this.mapper.map(
            data,
            MinecraftServerOnlineStatus,
            JavaServer,
        );

        if (!found) {
            return await this.javaServerRepository.save(
                {
                    ...mappedData,
                    owner: user,
                    owner_id: user.id,
                    verification: verification,
                },
                {reload: true},
            );
        }

        return await this.javaServerRepository.save({
            ...found,
            ...mappedData,
        });
    }

    private async createOrUpdateBedrockServer(
        data: MinecraftServerOnlineStatus,
        user: User,
        verification: ServerVerification,
    ): Promise<BedrockServer> {
        const found = await this.bedrockServerRepository
            .createQueryBuilder('server')
            .where({ip_address: data.ip, port: data.port})
            .orWhere({host: data.hostname})
            .getOne();

        const mappedData = this.mapper.map(
            data,
            MinecraftServerOnlineStatus,
            BedrockServer,
        );

        if (!found) {
            return await this.bedrockServerRepository.save(
                {
                    ...mappedData,
                    owner: user,
                    owner_id: user.id,
                    verification: verification,
                },
                {reload: true},
            );
        }

        return await this.bedrockServerRepository.save({
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
