import {RedisModule} from '@backend/redis';
import type {ModuleMetadata} from '@nestjs/common/interfaces/modules/module-metadata.interface';
import {APP_FILTER, APP_GUARD} from '@nestjs/core';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {Module, type Provider} from '@nestjs/common';
import {AutomapperModule} from '@automapper/nestjs';
import {PassportModule} from '@nestjs/passport';
import {ScheduleModule} from '@nestjs/schedule';
import {seconds, ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {TypeOrmModule} from '@nestjs/typeorm';
import {classes} from '@automapper/classes';
import {CqrsModule} from '@nestjs/cqrs';
import {ApiConfig, getConfigs, ProjectConfig, RedisConfig} from '@backend/config';
import {DataBaseModule, Session} from '@backend/db';
import {LoggerModule} from '@backend/logger';
import {ServersModule} from '../servers';
import {UsersModule} from '../users';
import {SentryGlobalFilter, SentryModule} from '@sentry/nestjs/setup';

const interceptors: Provider[] = [
    {
        provide: APP_FILTER,
        useClass: SentryGlobalFilter,
    },
];
const guards: Provider[] = [
    {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
    },
];

const configs = getConfigs(ProjectConfig, ApiConfig, RedisConfig);

const serverModules: ModuleMetadata['imports'] = [
    DataBaseModule,
    ServersModule,
    LoggerModule,
    UsersModule,
];

@Module({
    imports: [
        SentryModule.forRoot(),
        EventEmitterModule.forRoot(),
        CqrsModule.forRoot(),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        PassportModule.register({session: true}),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: 'default',
                    ttl: seconds(60),
                    limit: 20,
                },
            ],
        }),
        ...configs,
        ...serverModules,
        TypeOrmModule.forFeature([Session]),
        RedisModule,
    ],
    providers: [...interceptors, ...guards],
})
export class AppModule {}
