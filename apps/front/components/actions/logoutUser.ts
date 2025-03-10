'use server';

import {CookieNames} from '@shared/enums';
import {revalidateTag} from 'next/cache';
import {cookies} from 'next/headers';
import {customFetch} from './baseFetch';

export async function logoutUser(): Promise<void> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return null;
    }

    await customFetch<unknown>(
        `/users/logout`,
        {
            method: 'POST',
            next: {tags: ['/users/logout']},
        },
        {
            onSuccess: () => {
                revalidateTag('/users/status');
                revalidateTag('/users/has-credentials');
            },
        },
    );
}
