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
        if (hostName) whereCondition.server = {host: hostName};
        if (userId) whereCondition.user_id = userId;

        const awaitingVerifications = await this.verificationRepository.find({
            where: whereCondition,
            relations: {server: true, user: true},
        });

        if (awaitingVerifications.length === 0) {
            this.logger.log('No pending verifications found.');
            return [];
        }

        this.logger.log(
            `Found ${awaitingVerifications.length} pending verifications.`,
        );

        const checkedVerifications: {
            verification: ServerVerification;
            status: boolean;
        }[] = await Promise.all(
            awaitingVerifications.map(this.checkServerVerification.bind(this)),
        );

        const passingVerifications = checkedVerifications.filter(
            ({status}) => status,
        );
        if (passingVerifications.length === 0) {
            this.logger.log('No verifications passed the MOTD check.');
            return [];
        }

        this.logger.log(`${passingVerifications.length} verifications passed.`);

        await Promise.all(
            passingVerifications.map(async ({verification}) => {
                verification.verified = true;
                await this.verificationRepository.save(verification);
            }),
        );

        const uniqueServerIds = Array.from(
            new Set(
                passingVerifications.map(({verification}) => verification.server.id),
            ),
        );

        const serversToActivate = await this.serverRepository.find({
            where: {id: In(uniqueServerIds)},
            relations: {verifications: true},
        });

        const updatedServers = serversToActivate.map((server) => {
            server.isActive = true;

            if (!server.owner_id) {
                const match = passingVerifications.find(
                    ({verification}) => verification.server.id === server.id,
                );
                if (match) server.owner_id = match.verification.user_id;
            }

            return server;
        });

        await this.serverRepository.save(updatedServers);

        this.logger.log(
            `Activated ${
                updatedServers.length
            } servers and assigned owners where applicable.${
                hostName ? ` Host: ${hostName}` : ''
            }`,
        );

        return updatedServers;
    }

    private async checkServerVerification(
        verification: ServerVerification,
    ): Promise<{verification: ServerVerification; status: boolean}> {
        const {server, code} = verification;
        const address = `${server.host || server.ip_address}${
            server.port ? `:${server.port}` : ''
        }`;

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

            if (stats instanceof MinecraftServerOfflineStatus) {
                this.logger.debug(`Server ${address} is offline.`);
                return {verification, status: false};
            }

            const cleanMotd = stats.motd.raw.join(' ').toLowerCase();
            const verified = cleanMotd.includes(code.toLowerCase());

            this.logger.debug(
                `Checked server ${address}: ${
                    verified ? '✅ Verified' : '❌ Not Verified'
                }`,
            );

            return {verification, status: verified};
        } catch (error) {
            this.logger.warn(`Failed to verify server ${address}: ${error.message}`);
            return {verification, status: false};
        }
    }
}
