import type {FactoryProvider} from '@nestjs/common';
import {Redis} from 'ioredis';
import {RedisConfig} from '@backend/config';

export const RedisToken = 'RedisClient' as const;

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: RedisToken,
    useFactory: (redisConfig: RedisConfig) => {
        const redisInstance = new Redis({
            host: redisConfig.REDIS_HOST,
            port: redisConfig.REDIS_PORT,
        });

        redisInstance.on('error', (e) => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
    inject: [RedisConfig],
};
