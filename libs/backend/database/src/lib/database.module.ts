import {Global, Logger, Module, OnModuleInit} from '@nestjs/common';
import {migrationsRunner} from './migrations-runner';
import {getConfig} from './db-config';
import 'pg';
import {TypeOrmModule} from '@nestjs/typeorm';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot(getConfig())],
})
export class DataBaseModule implements OnModuleInit {
    private readonly logger = new Logger(DataBaseModule.name);

    async onModuleInit() {
        this.logger.log(`Running migrations on database...`);
        await migrationsRunner();
        this.logger.log(`Finished migrations!`);
    }
}
