'use server';

import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';

export async function customFetch<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const cookieStore = await cookies();
    const sessionCookieValue = cookieStore.get(CookieNames.SESSION_ID)?.value;

    const headers = new Headers(options?.headers);
    headers.append('Content-Type', 'application/json');
    if (sessionCookieValue) {
        headers.append('Cookie', `${CookieNames.SESSION_ID}=${sessionCookieValue}`);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers,
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}
