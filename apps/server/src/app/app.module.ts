import {ModuleMetadata} from '@nestjs/common/interfaces/modules/module-metadata.interface';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {Module, type Provider} from '@nestjs/common';
import {AutomapperModule} from '@automapper/nestjs';
import {classes} from '@automapper/classes';
import {CqrsModule} from '@nestjs/cqrs';
import {ApiConfig, getConfigs, ProjectConfig} from '@backend/config';
import {LoggerModule} from '@backend/logger';
import {DataBaseModule} from '@backend/db';
import {ServersModule} from '../servers';

const interceptors: Provider[] = [];

const configs = getConfigs(ProjectConfig, ApiConfig);

const serverModules: ModuleMetadata['imports'] = [DataBaseModule, ServersModule];

@Module({
    imports: [
        LoggerModule,
        EventEmitterModule.forRoot(),
        CqrsModule,
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        ...configs,
        ...serverModules,
    ],
    providers: [...interceptors],
})
export class AppModule {}
