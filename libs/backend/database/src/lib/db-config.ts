import type {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type {DataSourceOptions} from 'typeorm';
import {join} from 'path';
import {DatabaseSchema} from '@backend/config';
import {
    BedrockServer,
    DiscordOAuth2Credentials,
    JavaServer,
    Server,
    ServerRanking,
    ServerVerification,
    Session,
    User,
    UserCredentials,
    Vote,
} from './entities';
import {
    InitDB1738498523335,
    RemoveTimeData1738499883841,
    ServerAdditionalInfo1738720838341,
    SessionDeletedAt1738793624563,
    UserAuth1738523212153,
    UserAvatarNullable1738793280539,
    UserCredentials1738883140309,
    ServerRanking1739314805437,
    OptionalOwner1739827957429,
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
            UserCredentials,
            ServerRanking,
        ],
        migrations: [
            InitDB1738498523335,
            RemoveTimeData1738499883841,
            UserAuth1738523212153,
            ServerAdditionalInfo1738720838341,
            UserAvatarNullable1738793280539,
            SessionDeletedAt1738793624563,
            UserCredentials1738883140309,
            ServerRanking1739314805437,
            OptionalOwner1739827957429,
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
