import type {Request} from 'express';
import type {LogEntry} from 'winston';
import type {Method} from 'axios';

export type RequestMetadata = {
    user?: {
        id: string;
        email: string;
        type: string;
    };
    request?: {
        path: `${Uppercase<Method>} ${Request['path']}`;
        query: Request['query'];
        params: Request['params'];
    };
    data?: Record<string, unknown>;
    traceId?: string;
    spanId?: string;
    context: string;
    app: string;
};

export type LogEvent = LogEntry & RequestMetadata;
