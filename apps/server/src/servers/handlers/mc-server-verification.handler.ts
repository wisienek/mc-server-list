import {GetServerStatsQuery, VerifyServerCommand} from '@backend/commander';
import {Server, ServerVerification} from '@backend/db';
import {CommandHandler, type ICommandHandler, QueryBus} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {MinecraftServerOfflineStatus} from '@shared/dto';
import {plainToInstance} from 'class-transformer';
import {Repository} from 'typeorm';
import {Logger} from '@nestjs/common';
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
        const {hostName} = command;

        const whereCondition = {
            verified: false,
            ...(hostName ? {server: {host: hostName}} : {}),
        };

        const awaitingServers = await this.verificationRepository.find({
            where: whereCondition,
            relations: {server: true},
        });

        if (awaitingServers.length === 0) {
            return;
        }

        const checkedServers = await Promise.all(
            awaitingServers.map((v) => this.checkServerVerification(v)),
        );

        const passingVerification = checkedServers.filter(({status}) => status);

        await Promise.all(
            passingVerification.map(async ({verification}) => {
                verification.verified = true;
                verification.server.isActive = true;

                await this.verificationRepository.save(verification);
                await this.serverRepository.save(verification.server);
            }),
        );

        this.logger.log(
            `Verification passed: ${passingVerification.length} out of ${
                checkedServers.length
            } servers.${hostName ? ` For: ${hostName}` : ''}`,
        );
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
