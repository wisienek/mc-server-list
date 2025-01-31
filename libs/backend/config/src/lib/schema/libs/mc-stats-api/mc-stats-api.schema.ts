import {Injectable} from '@nestjs/common';
import {Config} from 'nest-zod-config';
import {z} from 'zod';

export const McStatsApiSchema = z.object({
    MC_STATS_URL: z
        .string()
        .url('Must be a valid url')
        .default('https://api.mcsrvstat.us/'),
});

@Injectable()
export class McStatsConfig extends Config(McStatsApiSchema) {}
