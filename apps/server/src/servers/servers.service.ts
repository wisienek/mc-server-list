import {Repository, type FindOptionsWhere} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {Injectable} from '@nestjs/common';
import {nanoid} from 'nanoid';
import {
    BedrockServer,
    JavaServer,
    Server,
    ServerVerification,
    User,
} from '@backend/db';
import {MCStatsService} from '@backend/mc-stats';
import {ServerType} from '@shared/enums';
import {Logger} from '@backend/logger';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ListServersDto,
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
    Pagination,
    ServerDto,
    VerifyServerDto,
} from '@shared/dto';
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
        private readonly logger: Logger,
        private readonly mcStatsService: MCStatsService,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    public async listServers(filters: ListServersDto): Promise<Pagination<Server>> {
        const query = this.serverRepository
            .createQueryBuilder('server')
            .where('server.isActive = :isActive', {isActive: true});

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

        const page = filters.page || 1;
        const perPage = filters.perPage || 10;
        query.skip((page - 1) * perPage).take(perPage);

        const [items, total] = await query.getManyAndCount();

        return new Pagination<Server>(items, total, perPage, page);
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

        // FIXME: users service
        const user = {} as User;

        const isBedrock = data.type === ServerType.BEDROCK;

        const fetchedServer = await this.mcStatsService.fetchServerInfo(
            `${data.hostname}:${data.port}`,
            isBedrock,
        );

        const verification = this.verificationRepository.create({
            code: nanoid(),
            expiresAt: Date.now() + 1_000 * 60 * 60, // 1hr
        });

        if (fetchedServer instanceof MinecraftServerOnlineStatus) {
            await (isBedrock
                ? this.createOrUpdateBedrockServer
                : this.createOrUpdateJavaServer)(fetchedServer, user, verification);
        }

        return verification;
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

        const isVerified =
            fetchInfo.motd.clean.includes(server.verification.code) &&
            Date.now() <= server.verification.expiresAt &&
            !server.isActive;

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
            .where({ip: data.ip, port: data.port})
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
            .where({ip: data.ip, port: data.port})
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
}
