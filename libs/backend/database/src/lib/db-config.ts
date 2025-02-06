import type {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type {DataSourceOptions} from 'typeorm';
import {join} from 'path';
import {DatabaseSchema} from '@backend/config';
import {
    BedrockServer,
    DiscordOAuth2Credentials,
    JavaServer,
    Server,
    ServerVerification,
    Session,
    User,
    Vote,
} from './entities';
import {
    InitDB1738498523335,
    RemoveTimeData1738499883841,
    ServerAdditionalInfo1738720838341,
    SessionDeletedAt1738793624563,
    UserAuth1738523212153,
    UserAvatarNullable1738793280539,
} from './migrations';

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
        entities: [
            Server,
            BedrockServer,
            JavaServer,
            ServerVerification,
            User,
            DiscordOAuth2Credentials,
            Session,
            Vote,
        ],
        migrations: [
            InitDB1738498523335,
            RemoveTimeData1738499883841,
            UserAuth1738523212153,
            ServerAdditionalInfo1738720838341,
            UserAvatarNullable1738793280539,
            SessionDeletedAt1738793624563,
        ],
    };
};

export const exportConfig = (): DataSourceOptions => {
    return {
        ...getDefaultConfig(),
        entities: [join(__dirname, 'entities', '/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, 'migrations', '/**/*{.ts,.js}')],
    };
};
