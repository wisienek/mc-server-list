import type {QueryRunner} from 'typeorm/query-runner/QueryRunner';
import type {Logger as TLogger} from 'typeorm/logger/Logger';
import {Inject, Injectable} from '@nestjs/common';
import {Logger as WLogger} from 'winston';
import {INQUIRER} from '@nestjs/core';
import type {ContextCompatible} from '@lib/types';
import {SimpleLogger} from './simple-logger';

@Injectable()
export class DatabaseLogger extends SimpleLogger implements TLogger {
    override _logger: WLogger;

    constructor(@Inject(INQUIRER) protected override parentClass: object) {
        super(parentClass);
    }

    public static override create(context?: ContextCompatible) {
        const logger = new DatabaseLogger({});
        logger.setContext(context);
        return logger;
    }

    logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
        const paramText =
            parameters && parameters.length
                ? ` -- Parameters: ${JSON.stringify(parameters)}`
                : '';
        this.debug(`Executed Query: ${query}${paramText}`);
    }

    logQueryError(
        error: string | Error,
        query: string,
        parameters?: any[],
        _queryRunner?: QueryRunner,
    ) {
        const paramText =
            parameters && parameters.length
                ? ` -- Parameters: ${JSON.stringify(parameters)}`
                : '';
        const errorMessage = typeof error === 'string' ? error : error.message;
        this.error(`Query Failed: ${query}${paramText}\nError: ${errorMessage}`, {
            error,
        });
    }

    logQuerySlow(
        time: number,
        query: string,
        parameters?: any[],
        _queryRunner?: QueryRunner,
    ) {
        const paramText =
            parameters && parameters.length
                ? ` -- Parameters: ${JSON.stringify(parameters)}`
                : '';
        this.warn(
            `Slow Query Detected (Execution Time: ${time}ms): ${query}${paramText}`,
        );
    }

    logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
        this.debug(`Schema Build: ${message}`);
    }

    logMigration(message: string, _queryRunner?: QueryRunner) {
        this.debug(`Migration: ${message}`);
    }
}
