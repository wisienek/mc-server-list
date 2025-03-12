import {GetServerStatsQuery, VerifyServerCommand} from '@backend/commander';
import {Server, ServerVerification} from '@backend/db';
import {CommandHandler, ICommandHandler, QueryBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {MinecraftServerOfflineStatus} from '@shared/dto';
import {plainToInstance} from 'class-transformer';
import {In, Repository} from 'typeorm';
import {Logger} from '@nestjs/common';
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere';
import type {GetServerStatsQueryHandlerReturnType} from './mc-server-stats.handler';

@CommandHandler(VerifyServerCommand)
export class VerifyServerCommandHandler
    implements ICommandHandler<VerifyServerCommand>
{
    private readonly logger = new Logger(VerifyServerCommandHandler.name);

    constructor(
        @InjectRepository(ServerVerification)
        private readonly verificationRepository: Repository<ServerVerification>,
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: VerifyServerCommand): Promise<Server[]> {
        const {hostName, userId} = command;

        const whereCondition: FindOptionsWhere<ServerVerification> = {
            verified: false,
        };

        if (hostName) {
            whereCondition.server = {host: hostName};
        }
        if (userId) {
            whereCondition.user_id = userId;
        }

        const awaitingVerifications = await this.verificationRepository.find({
            where: whereCondition,
            relations: {server: true, user: true},
        });

        if (awaitingVerifications.length === 0) {
            return [];
        }

        const checkedVerifications = await Promise.all(
            awaitingVerifications.map((verification) =>
                this.checkServerVerification(verification),
            ),
        );

        const passingVerifications = checkedVerifications.filter(
            ({status}) => status,
        );

        await Promise.all(
            passingVerifications.map(async ({verification}) => {
                verification.verified = true;
                await this.verificationRepository.save(verification);
            }),
        );

        const uniqueServers = new Set(
            passingVerifications.map(({verification}) => verification.server.id),
        );

        const serversToActivate = await this.serverRepository.find({
            where: {
                id: In(Array.from(uniqueServers)),
            },
        });

        serversToActivate.forEach((server) => (server.isActive = true));
        await this.serverRepository.save(serversToActivate);

        this.logger.log(
            `Verification passed: ${passingVerifications.length} out of ${
                checkedVerifications.length
            } verifications.${hostName ? ` For: ${hostName}` : ''}`,
        );

        return serversToActivate;
    }

    private async checkServerVerification(
        verification: ServerVerification,
    ): Promise<{verification: ServerVerification; status: boolean}> {
        const {server} = verification;
        const address = server.host ?? `${server.ip_address}:${server.port}`;

        const {stats}: GetServerStatsQueryHandlerReturnType =
            await this.queryBus.execute(
                plainToInstance(GetServerStatsQuery, {
                    type: server.type,
                    host: address,
                }),
            );

        if (stats instanceof MinecraftServerOfflineStatus) {
            return {verification, status: false};
        }

        const cleanMotd = stats.motd.clean.join(' ').toLowerCase();
        const motdHasData = cleanMotd.includes(verification.code.toLowerCase());
        return {verification, status: motdHasData};
    }
}
