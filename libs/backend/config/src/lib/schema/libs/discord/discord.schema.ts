import {Injectable} from '@nestjs/common';
import {Config} from 'nest-zod-config';
import {z} from 'zod';

export const DiscordSchema = z.object({
    DISCORD_CLIENT_ID: z.preprocess((val: string) => {
        // Some trick since client id is too big for the safe int
        return val.replace(/[<>]/g, '');
    }, z.string()),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_REDIRECT_URI: z.string().url(`Insert a valid url with scopes`),
});

@Injectable()
export class DiscordConfig extends Config(DiscordSchema) {}
