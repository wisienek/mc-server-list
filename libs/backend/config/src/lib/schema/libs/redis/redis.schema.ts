import {Injectable} from '@nestjs/common';
import {Config} from 'nest-zod-config';
import {z} from 'zod';

export const RedisSchema = z.object({
    REDIS_HOST: z
        .string()
        .min(4, 'REDIS_HOST must be at least 3 characters long')
        .default('localhost'),
    REDIS_PORT: z.coerce
        .number()
        .int('REDIS_PORT must be an integer')
        .positive('REDIS_PORT must be a positive number')
        .max(65535, 'DB_PORT must be a valid port number (max 65535)')
        .default(6379),
    DEFAULT_CACHE_TIME: z.number().gt(30_000).default(60_000),
});

@Injectable()
export class RedisConfig extends Config(RedisSchema) {}
