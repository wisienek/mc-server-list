'use server';

import {SerializedResult, serializeResult} from '@core';
import {UserDto} from '@shared/dto';
import {Ok} from 'oxide.ts';
import {customFetch} from './baseFetch';

export async function getUserData(
    sessionId: string,
): Promise<SerializedResult<UserDto | null>> {
    if (!sessionId) {
        return serializeResult(Ok(null));
    }

    const result = await customFetch<UserDto>('/users/status', {
        next: {tags: ['/users/status'], revalidate: 300},
    });

    return serializeResult(result);
}
