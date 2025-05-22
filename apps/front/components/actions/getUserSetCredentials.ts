'use server';

import {SerializedResult, serializeResult} from '@core';
import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {Ok} from 'oxide.ts';
import {customFetch} from './baseFetch';

export async function getUserSetCredentials(): Promise<
    SerializedResult<boolean | null>
> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return serializeResult(Ok(null));
    }

    const result = await customFetch<boolean>(`/users/has-credentials`, {
        next: {tags: ['/users/has-credentials'], revalidate: 300},
    });

    return serializeResult(result);
}
