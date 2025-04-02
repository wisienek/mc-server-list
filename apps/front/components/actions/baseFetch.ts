'use server';

import {parseResult, TError, type TErrorConstructor} from '@core';
import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {Result, Err} from 'oxide.ts';

type CallbacksType<T> = {
    onSuccess?: (outputData?: {
        data?: Result<T, TErrorConstructor>;
        response?: Response;
    }) => void | Promise<void>;
    onError?: (error?: TErrorConstructor) => void | Promise<void>;
};

export async function customFetch<T>(
    url: string,
    options: RequestInit = {
        next: {
            revalidate: 60,
        },
    },
    callbacks: CallbacksType<T> = {},
): Promise<Result<T, TErrorConstructor>> {
    const cookieStore = await cookies();
    const sessionCookieValue = cookieStore.get(CookieNames.SESSION_ID)?.value;

    const headers = new Headers(options?.headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (sessionCookieValue) {
        headers.append('Cookie', `${CookieNames.SESSION_ID}=${sessionCookieValue}`);
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
            ...options,
            credentials: 'include',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            const tError = new TError({
                key: 'errors.generic.unknown',
                code: response.status as never,
                data: {
                    status: response.status,
                    message: errorData?.message ?? response.statusText,
                    url,
                },
            });

            await callbacks.onError?.(tError.toJSON());
            return Err(tError.toJSON());
        }

        const body = await response.json();
        const returnData = parseResult<T, TError>(body);

        await callbacks.onSuccess?.({data: returnData, response});

        return returnData;
    } catch (error) {
        const tError = new TError({
            key: 'errors.generic.fetchFailed',
            code: 500,
            data: {
                message: (error as Error)?.message,
                url,
            },
        });

        await callbacks.onError?.(tError);
        return Err(tError.toJSON());
    }
}
