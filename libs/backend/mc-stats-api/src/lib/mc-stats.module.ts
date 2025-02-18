import type {HttpModuleOptions} from '@nestjs/axios/dist/interfaces/http-module.interface';
import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {getConfigs, McStatsConfig} from '@backend/config';
import {MCStatsService} from './mc-stats.service';

const configs = getConfigs(McStatsConfig);

@Module({
    imports: [
        ...configs,
        HttpModule.registerAsync({
            imports: [...configs],
            useFactory: (config: McStatsConfig) => {
                return {
                    baseURL: config.MC_STATS_URL,
                } satisfies HttpModuleOptions;
            },
            inject: [McStatsConfig],
        }),
    ],
    providers: [MCStatsService],
    exports: [MCStatsService],
})
export class MCStatsModule {}
