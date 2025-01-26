import {EventEmitterModule} from '@nestjs/event-emitter';
import {Module, type Provider} from '@nestjs/common';
import {AutomapperModule} from '@automapper/nestjs';
import {classes} from '@automapper/classes';
import {CqrsModule} from '@nestjs/cqrs';
import {ApiConfig, getConfigs, ProjectConfig} from '@backend/config';
import {LoggerModule} from '@backend/logger';

const interceptors: Provider[] = [];

const configs = getConfigs(ProjectConfig, ApiConfig);

@Module({
    imports: [
        LoggerModule,
        EventEmitterModule.forRoot(),
        CqrsModule,
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        ...configs,
    ],
    providers: [...interceptors],
})
export class AppModule {}
