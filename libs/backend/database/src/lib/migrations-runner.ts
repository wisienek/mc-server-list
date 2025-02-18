import {DataSource} from 'typeorm';
import {DatabaseLogger} from '@backend/logger';
import {getConfig} from './db-config';

export const migrationsRunner = async () => {
    const dbConfig = getConfig();

    const connection = await new DataSource({
        logger: DatabaseLogger.create(`Database`),
        ...dbConfig,
        synchronize: false,
        logging: true,
        name: 'MIGRATIONS_CONN',
    }).initialize();

    await connection.runMigrations({transaction: 'each'});
    await connection.destroy();
};
