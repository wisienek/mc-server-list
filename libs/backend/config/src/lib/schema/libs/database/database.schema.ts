import { Injectable } from '@nestjs/common';
import { Config } from 'nest-zod-config';
import { z } from 'zod';

export const DatabaseSchema = z.object({
  DB_HOST: z.string().min(4, 'DB_HOST must be at least 3 characters long').default('localhost'),
  DB_PORT: z.coerce
    .number()
    .int('DB_PORT must be an integer')
    .positive('DB_PORT must be a positive number')
    .max(65535, 'DB_PORT must be a valid port number (max 65535)')
    .default(5432),
  DB_USERNAME: z.string().min(3, 'DB_USERNAME cannot be empty'),
  DB_PASSWORD: z.string().min(8, 'DB_PASSWORD must be at least 8 characters long'),
});

@Injectable()
export class DatabaseConfig extends Config(DatabaseSchema) {}
