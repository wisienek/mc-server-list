import {VerifyServerCommand, VerifyTimeoutsCommand} from '@backend/commander';
import {CommandBus} from '@nestjs/cqrs';
import {SchedulerRegistry} from '@nestjs/schedule';
import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {CronJob} from 'cron';
import {ApiConfig} from '@backend/config';
import {ServerCrons} from '@shared/enums';

@Injectable()
export class ServerVerificationService implements OnApplicationBootstrap {
    private readonly jobs: Set<CronJob>;

    constructor(
        private readonly apiConfig: ApiConfig,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly logger: Logger,
        private readonly commandBus: CommandBus,
    ) {
        this.jobs = new Set<CronJob>();

        if (this.apiConfig.AUTOMATIC_VERIFICATION) {
            const job = new CronJob(
                `0 */15 * * * *`,
                async () => {
                    await this.commandBus.execute(new VerifyServerCommand());
                },
                () => this.logger.log(`Finished server verification!`),
                null,
                'Europe/Warsaw',
            );

            this.schedulerRegistry.addCronJob(ServerCrons.SERVER_VERIFICATION, job);
            this.jobs.add(job);
        }

        const timeoutJob = new CronJob(
            `0 0 * * * *`,
            async () => {
                await this.commandBus.execute(new VerifyTimeoutsCommand());
            },
            () => this.logger.log(`Finished server verification!`),
            null,
            'Europe/Warsaw',
        );

        this.schedulerRegistry.addCronJob(ServerCrons.SERVER_TIMEOUTS, timeoutJob);
        this.jobs.add(timeoutJob);
    }

    public onApplicationBootstrap() {
        this.jobs.forEach((j) => j.start());
    }
}
