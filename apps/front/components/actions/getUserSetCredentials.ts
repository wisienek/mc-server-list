'use server';

import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {customFetch} from './baseFetch';

export async function getUserSetCredentials(): Promise<boolean> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return null;
    }

    return customFetch<boolean>(`/users/has-credentials`, {
        next: {tags: ['/users/has-credentials'], revalidate: 300},
    });
}
