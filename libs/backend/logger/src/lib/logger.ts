import type {Logger as WinstonLogger} from 'winston';
import type {LoggerService} from '@nestjs/common';
import {isArray, isObject} from 'lodash';
import type {
    ContextCompatible,
    LoggerPort,
    LogMethod,
    OptionalParamObjectType,
} from '@lib/types';
import {NodeEnv} from '@shared/enums';

export abstract class Logger implements LoggerService, LoggerPort {
    public loggerContext = 'Unknown';
    public abstract context: Map<string, any>;
    protected parent?: Logger;
    protected abstract _logger: WinstonLogger;
    protected _logLevel = process.env['LOG_LEVEL'] || 'info';

    protected getMetadata(): {[optionName: string]: any} {
        return {};
    }

    public setContext(context: ContextCompatible | undefined) {
        if (context) {
            const _context = typeof context === 'string' ? context : context?.name;
            this.loggerContext =
                _context.slice(0, 1).toUpperCase() + _context.slice(1);
        }
    }

    public abstract child(context?: ContextCompatible): Logger;

    error: LogMethod = (...args) => {
        const {
            message,
            meta: {error, context, ...metadata},
        } = this.parseArgs(args);
        this._logger.error(message, {
            ...metadata,
            context,
            error: this.isDev()
                ? error
                : {...error, stack: error?.stack?.toString()},
        });
        if (error && this.isDev()) {
            console.error(error.stack?.slice(error?.stack?.indexOf('[0m  [0m[90m-')));
        }
    };

    warn: LogMethod = (...args) => {
        const {message, meta} = this.parseArgs(args);
        this._logger.warn(message, meta);
    };

    log: LogMethod = (...args) => {
        const {message, meta} = this.parseArgs(args);
        this._logger.info(message, meta);
    };

    info: LogMethod = (...args) => {
        this.log(...args);
    };

    verbose: LogMethod = (...args) => {
        const {message, meta} = this.parseArgs(args);
        this._logger.verbose(message, meta);
    };

    debug: LogMethod = (...args) => {
        const {message, meta} = this.parseArgs(args);
        this._logger.debug(message, meta);
    };

    private parseArgs(args: unknown[]) {
        const metadata = this.getMetadata();
        const messages: string[] = [];
        const errors: Error[] = [];
        let data: OptionalParamObjectType = metadata['data'] ?? {};

        for (const [i, arg] of args.entries()) {
            if (arg instanceof Error) {
                errors.push(arg);
                messages.push(String(arg));
            } else if (isObject(arg)) {
                data = {...data, ...(isArray(arg) ? {[`arg${i}`]: arg} : arg)};
            } else {
                messages.push(String(arg));
            }
        }

        let context: string;

        if (
            !data.context &&
            messages.length > 1 &&
            messages.at(-1)?.match(/^[A-Z][a-z]*([A-Z][a-z]*)*$/)
        ) {
            // NestJs default logger signature with context at the end
            context = messages?.pop() ?? 'unknown';
        } else {
            context = data.context ?? metadata['context'] ?? this.loggerContext;
        }

        return {
            message: messages.join(', '),
            meta: {
                ...metadata,
                data,
                context,
                error: errors[0],
            },
        };
    }

    protected isDev() {
        return process.env['NODE_ENV'] !== NodeEnv.PROD;
    }
}
