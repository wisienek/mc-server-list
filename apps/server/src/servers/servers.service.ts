import {Repository, type FindOptionsWhere} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {InjectMapper} from '@automapper/nestjs';
import type {Mapper} from '@automapper/core';
import {Injectable} from '@nestjs/common';
import {nanoid} from 'nanoid';
import {BedrockServer, JavaServer, ServerVerification, User} from '@backend/db';
import {MCStatsService} from '@backend/mc-stats';
import {ServerType} from '@shared/enums';
import {Logger} from '@backend/logger';
import {
    CreateServerDto,
    CreateServerResponseDto,
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
    VerifyServerDto,
} from '@shared/dto';
import {
    ServerAlreadyClaimedError,
    ServerExistsError,
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
        private readonly logger: Logger,
        private readonly mcStatsService: MCStatsService,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

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

    public async verifyServer(data: VerifyServerDto): Promise<void> {
        const server = await this.getServerByHostNameOrIP(data);
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
            await this.createOrUpdateJavaServer(
                fetchInfo,
                server.owner,
                server.verification,
            );
        } else {
            await this.bedrockServerRepository.save(server);
            await this.createOrUpdateBedrockServer(
                fetchInfo,
                server.owner,
                server.verification,
            );
        }
    }

    private async getServerByHostNameOrIP(data: {
        hostname?: string;
        port?: number;
        ip?: string;
    }): Promise<JavaServer | BedrockServer> {
        const searchData: FindOptionsWhere<JavaServer | BedrockServer> = {};

        data.ip && (searchData.ip_address = data.ip);
        data.port && (searchData.port = data.port);
        data.hostname && (searchData.host = data.hostname);

        return (
            (await this.javaServerRepository.findOne({
                where: {host: data.hostname, port: data.port, ip_address: data.ip},
                relations: {verification: true, owner: true},
            })) ??
            (await this.bedrockServerRepository.findOne({
                where: {host: data.hostname, port: data.port, ip_address: data.ip},
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
