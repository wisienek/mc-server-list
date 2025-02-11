import {Repository, type FindOptionsWhere} from 'typeorm';
import {SchedulerRegistry} from '@nestjs/schedule';
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CronJob} from 'cron';
import {MCStatsService} from '@backend/mc-stats';
import {Server, ServerVerification} from '@backend/db';
import {ApiConfig} from '@backend/config';
import {MinecraftServerOfflineStatus} from '@shared/dto';
import {ServerCrons, ServerType} from '@shared/enums';

@Injectable()
export class ServerVerificationService {
    constructor(
        @InjectRepository(ServerVerification)
        private readonly verificationRepository: Repository<ServerVerification>,
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        private readonly apiConfig: ApiConfig,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly logger: Logger,
        private readonly mcStatsService: MCStatsService,
    ) {
        if (this.apiConfig.AUTOMATIC_VERIFICATION) {
            const job = new CronJob(
                `0 */15 * * * *`,
                () => this.verifyServers(),
                () => this.logger.log(`Finished server verification!`),
                null,
                'Europe/Warsaw',
            );

            this.schedulerRegistry.addCronJob(ServerCrons.SERVER_VERIFICATION, job);
            job.start();
        }
    }

    /**
     * Automatically verify servers every 15 minutes
     * @returns {Promise<void>}
     */
    public async verifyServers(hostName?: string): Promise<void> {
        const whereCondition: FindOptionsWhere<ServerVerification> = {
            verified: false,
        };
        if (hostName !== undefined) {
            whereCondition.server = {host: hostName};
        }

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

    async checkServerVerification(
        verification: ServerVerification,
    ): Promise<{verification: ServerVerification; status: boolean}> {
        const {server} = verification;
        const address = server.host ?? `${server.ip_address}:${server.port}`;

        const fetchedStats = await this.mcStatsService.fetchServerInfo(
            address,
            server.type === ServerType.BEDROCK,
        );

        if (fetchedStats instanceof MinecraftServerOfflineStatus) {
            return {verification, status: false};
        }

        const cleanMotd = fetchedStats.motd.clean.join(' ');
        const motdHasData = cleanMotd.includes(verification.code);
        return {verification, status: motdHasData};
    }
}
