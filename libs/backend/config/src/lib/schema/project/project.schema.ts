import {Injectable} from '@nestjs/common';
import {Config} from 'nest-zod-config';
import {z} from 'zod';
import {NodeEnv} from '@shared/enums';

export const ProjectSchema = z.object({
    NODE_ENV: z
        .nativeEnum(NodeEnv, {description: `Current environment type`})
        .default(NodeEnv.LOCAL),
});

@Injectable()
export class ProjectConfig extends Config(ProjectSchema) {
    get isLocal(): boolean {
        return this.NODE_ENV === NodeEnv.LOCAL;
    }

    get isProd(): boolean {
        return this.NODE_ENV === NodeEnv.PROD;
    }
}
