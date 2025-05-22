import {HttpStatusCode} from '@shared/enums';

export type TErrorConstructor = {
    key: string;
    code: HttpStatusCode;
    data?: Record<string, any>;
};

export class TError {
    public readonly key: TErrorConstructor['key'];
    public readonly code: TErrorConstructor['code'];
    public readonly data?: TErrorConstructor['data'];

    constructor({key, code, data}: TErrorConstructor) {
        this.key = key;
        this.code = code;
        this.data = data;
    }

    public toJSON(): TErrorConstructor {
        return {
            key: this.key,
            code: this.code,
            data: this.data,
        };
    }

    static isError(error: unknown): error is TError {
        return (
            typeof error === 'object' &&
            'key' in error &&
            typeof error['key'] === 'string' &&
            'code' in error &&
            (typeof error['code'] === 'string' || typeof error['code'] === 'number')
        );
    }
}

export const Errors = {
    AlreadyGivenAVote: () =>
        new TError({
            key: 'errors.server.alreadyGivenAVote',
            code: HttpStatusCode.CONFLICT,
        }),

    ServerAlreadyClaimed: () =>
        new TError({
            key: 'errors.server.alreadyClaimed',
            code: HttpStatusCode.CONFLICT,
        }),

    ServerExists: (verificationCode?: string) =>
        new TError({
            key: 'errors.server.exists',
            code: HttpStatusCode.CONFLICT,
            data: verificationCode ? {verificationCode} : undefined,
        }),

    ServerNotFound: (hostname?: string, port?: number, ip?: string) =>
        new TError({
            key: 'errors.server.notFound',
            code: HttpStatusCode.NOT_FOUND,
            data: {hostname, port, ip},
        }),

    ServerNotOwnedByUser: (hostName: string, userId: string) =>
        new TError({
            key: 'errors.server.notOwnedByUser',
            code: HttpStatusCode.FORBIDDEN,
            data: {hostName, userId},
        }),

    ServerVerificationOffline: () =>
        new TError({
            key: 'errors.server.verificationOffline',
            code: HttpStatusCode.BAD_REQUEST,
        }),

    ServerVerificationUnsuccessful: () =>
        new TError({
            key: 'errors.server.verificationUnsuccessful',
            code: HttpStatusCode.BAD_REQUEST,
        }),

    UserNotFound: () =>
        new TError({
            key: 'errors.user.notFound',
            code: HttpStatusCode.NOT_FOUND,
        }),
    GenericUnknown: (code: HttpStatusCode, message?: string) =>
        new TError({
            key: 'errors.generic.unknown',
            code,
            data: message ? {message} : undefined,
        }),

    FetchFailed: (message: string, url?: string) =>
        new TError({
            key: 'errors.generic.fetchFailed',
            code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            data: {message, url},
        }),
} as const;
