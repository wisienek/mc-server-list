import type {ModuleMetadata} from '@nestjs/common/interfaces/modules/module-metadata.interface';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {Module, type Provider} from '@nestjs/common';
import {AutomapperModule} from '@automapper/nestjs';
import {PassportModule} from '@nestjs/passport';
import {ScheduleModule} from '@nestjs/schedule';
import {TypeOrmModule} from '@nestjs/typeorm';
import {classes} from '@automapper/classes';
import {CqrsModule} from '@nestjs/cqrs';
import {ApiConfig, getConfigs, ProjectConfig} from '@backend/config';
import {DataBaseModule, Session} from '@backend/db';
import {LoggerModule} from '@backend/logger';
import {ServersModule} from '../servers';
import {UsersModule} from '../users';

const interceptors: Provider[] = [];

const configs = getConfigs(ProjectConfig, ApiConfig);

const serverModules: ModuleMetadata['imports'] = [
    DataBaseModule,
    ServersModule,
    LoggerModule,
    UsersModule,
];

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        CqrsModule.forRoot(),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        PassportModule.register({session: true}),
        ScheduleModule.forRoot(),
        ...configs,
        ...serverModules,
        TypeOrmModule.forFeature([Session]),
    ],
    providers: [...interceptors],
})
export class AppModule {}
