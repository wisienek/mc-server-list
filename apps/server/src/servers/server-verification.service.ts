import {VerifyServerCommand, VerifyTimeoutsCommand} from '@backend/commander';
import {CommandBus} from '@nestjs/cqrs';
import {SchedulerRegistry} from '@nestjs/schedule';
import {Injectable, Logger, type OnApplicationBootstrap} from '@nestjs/common';
import {CronJob} from 'cron';
import {ApiConfig} from '@backend/config';
import {ServerCrons} from '@shared/enums';

@Injectable()
export class ServerVerificationService implements OnApplicationBootstrap {
    private readonly jobs: Set<CronJob>;
    private readonly logger = new Logger(ServerVerificationService.name);

    constructor(
        private readonly apiConfig: ApiConfig,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly commandBus: CommandBus,
    ) {
        this.jobs = new Set<CronJob>();

        if (this.apiConfig.AUTOMATIC_VERIFICATION) {
            const verificationJob = new CronJob(
                `0 */15 * * * *`,
                async () => {
                    this.logger.log(`Starting server verification...`);
                    await this.commandBus.execute(
                        new VerifyServerCommand(null, null),
                    );
                    this.logger.log(`Finished server verification!`);
                },
                null,
                false,
                'Europe/Warsaw',
            );

            this.schedulerRegistry.addCronJob(
                ServerCrons.SERVER_VERIFICATION,
                verificationJob,
            );
            this.jobs.add(verificationJob);
        }

        const timeoutJob = new CronJob(
            `0 0 * * * *`,
            async () => {
                this.logger.log(`Starting timeout verification...`);
                await this.commandBus.execute(new VerifyTimeoutsCommand());
                this.logger.log(`Finished timeout verification!`);
            },
            null,
            false,
            'Europe/Warsaw',
        );

        this.schedulerRegistry.addCronJob(ServerCrons.SERVER_TIMEOUTS, timeoutJob);
        this.jobs.add(timeoutJob);
    }

    public onApplicationBootstrap() {
        this.jobs.forEach((job) => job.start());
    }
}
