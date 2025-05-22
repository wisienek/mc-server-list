import type {ZodConfig} from 'nest-zod-config/dist/zod-config.types';
import {dotEnvLoader, envLoader, ZodConfigModule} from 'nest-zod-config';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export const getConfigs = (...configs: ZodConfig<any>[]) => {
    return configs.map((config) =>
        ZodConfigModule.forRootAsync({
            config: config,
            loader: isProduction
                ? envLoader({})
                : dotEnvLoader({
                      expandVariables: true,
                  }),
        }),
    );
};
