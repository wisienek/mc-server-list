import {Result, Ok, Err} from 'oxide.ts';
import {TError, TErrorConstructor} from '../errors';

export class SerializedResult<T, E extends TError | TErrorConstructor = TError> {
    ok?: T;
    err?: E;
}

export function serializeResult<T, E extends TError | TErrorConstructor = TError>(
    result: Result<T, E>,
): SerializedResult<T, TErrorConstructor> {
    if (result.isOk()) return {ok: result.unwrap()};
    const err = result.unwrapErr();
    return {
        err: {
            key: err.key,
            code: err.code,
            data: err.data,
        },
    };
}

export function parseResult<T, E extends TError | TErrorConstructor = TError>(
    data: SerializedResult<T, E>,
): Result<T, E> {
    return 'ok' in data ? Ok(data.ok as T) : Err(data.err as E);
}
