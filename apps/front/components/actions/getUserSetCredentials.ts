'use server';

import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {customFetch} from './baseFetch';

export async function getUserSetCredentials(): Promise<boolean | null> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return null;
    }

    const result = await customFetch<boolean>(`/users/has-credentials`, {
        next: {tags: ['/users/has-credentials'], revalidate: 300},
    });

    if (result.isErr()) {
        return null;
    }

    return result.unwrap();
}
