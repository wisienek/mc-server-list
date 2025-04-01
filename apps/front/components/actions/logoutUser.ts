'use server';

import {SerializedResult, serializeResult} from '@core';
import {CookieNames} from '@shared/enums';
import {revalidateTag} from 'next/cache';
import {cookies} from 'next/headers';
import {Ok} from 'oxide.ts';
import {customFetch} from './baseFetch';

export async function logoutUser(): Promise<SerializedResult<void>> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return serializeResult(Ok(null));
    }

    return serializeResult(
        await customFetch<null>(
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
        ),
    );
}
