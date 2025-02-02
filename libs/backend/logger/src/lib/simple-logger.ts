import {createLogger, format, Logger as WLogger, transports} from 'winston';
import {Inject, Injectable, Scope} from '@nestjs/common';
import * as PrettyError from 'pretty-error';
import {INQUIRER} from '@nestjs/core';
import type {ContextCompatible} from '@lib/types';
import {LocalLogFormat, ProductionLogFormat} from './format';
import type {RequestMetadata} from './types';
import {Logger} from './logger';

@Injectable({scope: Scope.TRANSIENT})
export class SimpleLogger extends Logger {
    _logger: WLogger;
    protected override parent: SimpleLogger;
    public readonly context: Map<string, any> = new Map();

    constructor(@Inject(INQUIRER) protected parentClass: object | undefined) {
        super();
        const parentName = parentClass?.['name'] || parentClass?.constructor?.name;
        if (parentName) {
            this.loggerContext = parentName;
        } else if (parentClass?.constructor?.name) {
            this.loggerContext = parentClass.constructor.name;
        }
        this._logger = this.initLogger();
        if (this.isDev()) {
            PrettyError.start();
        }
    }

    public child(context: ContextCompatible = 'child') {
        const child = new SimpleLogger(undefined);
        child.setContext(context);
        child.parent = this;
        return child;
    }

    public static create(context: ContextCompatible) {
        const logger = new SimpleLogger(undefined);
        logger.setContext(context);
        return logger;
    }

    protected initLogger(): WLogger {
        return createLogger({
            transports: [
                new transports.Console({
                    level: this._logLevel,
                    format: format.combine(
                        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:SSSS'}),
                        this.getLogFormat(),
                    ),
                }),
            ],
        });
    }

    protected getLogFormat() {
        return this.isDev()
            ? new LocalLogFormat().get()
            : new ProductionLogFormat().get();
    }

    protected override getMetadata(withData = true): RequestMetadata {
        const metadata = {
            context: this.loggerContext,
            app:
                process.env['NX_TASK_TARGET_PROJECT']?.slice(
                    process.env['NX_TASK_TARGET_PROJECT']?.indexOf('-') + 1,
                ) ||
                process.env['TRACING_SERVICE_NAME'] ||
                'API',
            data: withData ? Object.fromEntries(this.context) : undefined,
        };

        if (this.parent) {
            const parentMetadata = this.parent.getMetadata();
            return {
                ...metadata,
                ...parentMetadata,
                context: [parentMetadata.context, metadata.context].join(':'),
                data: {
                    ...parentMetadata.data,
                    ...(metadata.data || {}),
                },
            };
        }

        return metadata;
    }
}
