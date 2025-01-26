import {Format} from 'logform';
import {format} from 'winston';
import {inspect} from 'util';
import type {LogEvent} from '../types';

const clc = {
    bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
    green: (text: string) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
    red: (text: string) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const colorSchema: Record<string, (text: string) => string> = {
    info: clc.green,
    error: clc.red,
    warn: clc.yellow,
    debug: clc.magentaBright,
    verbose: clc.cyanBright,
};

export class LocalLogFormat {
    SHOW_TRACE_IN_LOCAL = false;

    get(): Format {
        return format.printf((args) => {
            const {
                app,
                context,
                level,
                timestamp,
                user,
                request,
                message,
                data,
                traceId,
                spanId,
            } = args as unknown as LogEvent;

            const color = colorSchema[level];
            const yellow = clc.yellow;

            let logEntry = `${color(`[${app.toUpperCase()}]`)} `;
            logEntry += `${yellow(level.toUpperCase().padEnd('VERBOSE'.length))} `;
            if (timestamp) {
                logEntry += `${timestamp}\t`;
            }

            if (context) {
                logEntry += `${yellow('[' + context + ']')} `;
            }

            if (user) {
                logEntry += `${color(
                    `[${user.type ? user.type + ' ' : ''}${
                        user.email ?? user.id ?? 'unknown'
                    }]`,
                )} `;
            }
            logEntry += `${color(message)}`;

            if (request && Object.keys(request).length > 0) {
                logEntry += ` - ${inspect(
                    JSON.parse(
                        JSON.stringify(
                            Object.fromEntries(
                                Object.entries(request).filter(([_, v]) =>
                                    typeof v === 'object'
                                        ? Object.keys(v).length
                                        : true,
                                ),
                            ),
                        ),
                    ),
                    {
                        colors: true,
                    },
                )}`;
            }

            if (data && Object.keys(data).length > 0) {
                logEntry += ` - ${inspect(data, {
                    colors: true,
                })}`;
            }

            if (this.SHOW_TRACE_IN_LOCAL) {
                logEntry += ` - ${inspect(
                    {traceId, spanId},
                    {
                        colors: true,
                    },
                )}`;
            }

            return logEntry;
        });
    }
}
