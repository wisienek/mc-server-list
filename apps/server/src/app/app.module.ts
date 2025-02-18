import {RedisModule} from '@backend/redis';
import {createKeyv, Keyv} from '@keyv/redis';
import {CacheModule} from '@nestjs/cache-manager';
import type {ModuleMetadata} from '@nestjs/common/interfaces/modules/module-metadata.interface';
import {APP_GUARD} from '@nestjs/core';
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
import {CacheableMemory} from 'cacheable';
import {ServersModule} from '../servers';
import {UsersModule} from '../users';

const interceptors: Provider[] = [];
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
        CacheModule.registerAsync({
            imports: [...getConfigs(RedisConfig)],
            isGlobal: true,
            useFactory: async (config: RedisConfig) => {
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({
                                ttl: config.DEFAULT_CACHE_TIME,
                                lruSize: 5_000,
                            }),
                        }),
                        createKeyv(
                            `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
                        ),
                    ],
                };
            },
            inject: [RedisConfig],
        }),
    ],
    providers: [...interceptors, ...guards],
})
export class AppModule {}
