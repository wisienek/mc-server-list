import {Injectable} from '@nestjs/common';
import {Config} from 'nest-zod-config';
import {z} from 'zod';

export const ApiSchema = z.object({
    APP_PORT: z.coerce
        .number({
            description:
                '.env files convert numbers to strings, therefore we have to enforce them to be numbers',
        })
        .positive()
        .max(65536, `options.port should be >= 0 and < 65536`)
        .default(3000),
    COOKIE_SECRET: z
        .string()
        .min(8, `Cookie secret should not have less then 8 chars.`),
    TOKEN_EXPIRATION_HOURS: z
        .number()
        .min(1, `Minimum 1 hour`)
        .max(35 * 24, `Maximum of 35 days (fib no.)`)
        .default(14 * 24),
    AUTOMATIC_VERIFICATION: z.boolean().default(true),
    AUTOMATIC_SERVER_TIMEOUT_TIMES: z.number().gt(0),
    AUTOMATIC_SERVER_TIMEOUT_BATCH: z.number().gt(20),
});

@Injectable()
export class ApiConfig extends Config(ApiSchema) {}
