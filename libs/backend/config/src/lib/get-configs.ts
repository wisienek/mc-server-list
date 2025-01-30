import type {ZodConfig} from 'nest-zod-config/dist/zod-config.types';
import {dotEnvLoader, ZodConfigModule} from 'nest-zod-config';
import 'dotenv/config';

export const getConfigs = (...configs: ZodConfig<any>[]) => {
    return configs.map((config) =>
        ZodConfigModule.forRootAsync({
            config: config,
            loader: dotEnvLoader({
                expandVariables: true,
            }),
        }),
    );
};
