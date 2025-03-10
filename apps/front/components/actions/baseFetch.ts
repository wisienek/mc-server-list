'use server';

import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';

export async function customFetch<T>(
    url: string,
    options: RequestInit = {
        next: {
            revalidate: 60,
        },
    },
    callbacks?: {
        onSuccess?: (data?: T) => void;
        onError?: (error: Error) => void;
    },
): Promise<T> {
    const cookieStore = await cookies();
    const sessionCookieValue = cookieStore.get(CookieNames.SESSION_ID)?.value;

    const headers = new Headers(options?.headers);
    headers.append('Content-Type', 'application/json');
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
            throw response.statusText;
        }

        const returnData: T = await response.json();
        if (callbacks.onSuccess) {
            callbacks.onSuccess(returnData);
        }

        return returnData;
    } catch (error) {
        if (callbacks.onError) {
            callbacks.onError(error);
        }

        console.error(`Error on fetch: ${JSON.stringify({url, options})}`, error);
        return null;
    }
}
