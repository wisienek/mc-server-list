'use server';

import {UserDto} from '@shared/dto';
import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {customFetch} from './baseFetch';

export async function getUserData(): Promise<UserDto | null> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return null;
    }

    const result = await customFetch<UserDto>('/users/status', {
        next: {tags: ['/users/status'], revalidate: 300},
    });

    if (result.isErr()) {
        return null;
    }

    return result.unwrap();
}
