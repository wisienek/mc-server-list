'use server';

import {SerializedResult, serializeResult} from '@core';
import {UserDto} from '@shared/dto';
import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {Ok} from 'oxide.ts';
import {customFetch} from './baseFetch';

export async function getUserData(): Promise<SerializedResult<UserDto | null>> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return serializeResult(Ok(null));
    }

    const result = await customFetch<UserDto>('/users/status', {
        next: {tags: ['/users/status'], revalidate: 300},
    });

    return serializeResult(result);
}
