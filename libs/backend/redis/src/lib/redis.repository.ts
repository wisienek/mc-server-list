import {Inject, Injectable, OnModuleDestroy} from '@nestjs/common';
import {Redis} from 'ioredis';
import {RedisToken} from './redis.provider';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
    constructor(@Inject(RedisToken) private readonly redisClient: Redis) {}

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    async get(prefix: string, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value);
    }

    async delete(prefix: string, key: string): Promise<void> {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(
        prefix: string,
        key: string,
        value: string,
        expiry: number,
    ): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    }
}
