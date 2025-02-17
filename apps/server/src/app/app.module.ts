import {RedisModule} from '@backend/redis';
import {createKeyv, Keyv} from '@keyv/redis';
import {CacheModule} from '@nestjs/cache-manager';
import type {ModuleMetadata} from '@nestjs/common/interfaces/modules/module-metadata.interface';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {Module, type Provider} from '@nestjs/common';
import {AutomapperModule} from '@automapper/nestjs';
import {PassportModule} from '@nestjs/passport';
import {ScheduleModule} from '@nestjs/schedule';
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
    providers: [...interceptors],
})
export class AppModule {}
