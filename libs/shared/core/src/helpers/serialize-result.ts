import {Err, Ok, Result} from 'oxide.ts';
import type {TErrorConstructor} from '../errors';
import {HttpStatusCode} from '@shared/enums';

export class SerializedResult<T> {
    ok?: T;
    err?: TErrorConstructor;
}

export function serializeResult<T, E extends TErrorConstructor = TErrorConstructor>(
    result: Result<T, E>,
): SerializedResult<T> {
    if (result.isOk()) return {ok: result.unwrap()};
    const err = result.unwrapErr();
    return {
        err: {
            key: err?.key ?? '',
            code: err?.code ?? HttpStatusCode.INTERNAL_SERVER_ERROR,
            data: err?.data ?? {},
        },
    };
}

export function parseResult<T, E extends TErrorConstructor = TErrorConstructor>(
    data: SerializedResult<T>,
): Result<T, E> {
    return 'ok' in data ? Ok(data.ok as T) : Err(data.err as E);
}
