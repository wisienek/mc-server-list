import type {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type {DataSourceOptions} from 'typeorm';
import {join} from 'path';
import {DatabaseSchema} from '@backend/config';
import {
    BedrockServer,
    JavaServer,
    Server,
    ServerVerification,
    User,
} from './entities';
import {InitDB1738195409779} from './migrations';

const getDefaultConfig = (): PostgresConnectionOptions => {
    const config = DatabaseSchema.parse(process.env);

    return {
        type: 'postgres',
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USERNAME,
        password: config.DB_PASSWORD,
        schema: 'public',
        migrationsTableName: 'migrations',
    };
};

export const getConfig = (): DataSourceOptions => {
    const defaultConfig = getDefaultConfig();

    return {
        ...defaultConfig,
        database: 'mc-list',
        entities: [Server, BedrockServer, JavaServer, ServerVerification, User],
        migrations: [InitDB1738195409779],
    };
};

export const exportConfig = (): DataSourceOptions => {
    return {
        ...getDefaultConfig(),
        entities: [join(__dirname, 'entities', '/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, 'migrations', '/**/*{.ts,.js}')],
    };
};
