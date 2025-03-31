'use server';

import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {Result, Ok, Err} from 'oxide.ts';

type CallbacksType<T> = {
    onSuccess?: (outputData?: {
        data?: T;
        response?: Response;
    }) => void | Promise<void>;
    onError?: (error?: Error) => void | Promise<void>;
};

export async function customFetch<T>(
    url: string,
    options: RequestInit = {
        next: {
            revalidate: 60,
        },
    },
    callbacks: CallbacksType<T> = {},
): Promise<Result<T, Error>> {
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
            const error = new Error(
                errorData.message || response.statusText || 'Unknown fetch error',
            );

            error['status'] = response.status;

            Err(error);
        }

        const returnData: T = await response.json();
        await callbacks.onSuccess?.({data: returnData, response});

        return Ok(returnData);
    } catch (error) {
        if (callbacks.onError) {
            await callbacks.onError(error as Error);
        }

        return Err(error);
    }
}
