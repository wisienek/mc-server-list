'use server';

import {UserDto} from '@shared/dto';
import {CookieNames} from '@shared/enums';
import {cookies} from 'next/headers';
import {customFetch} from './baseFetch';

export async function getUserData(): Promise<UserDto> {
    const sessionId = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    if (!sessionId) {
        return null;
    }

    return customFetch<UserDto>(`/users/status`, {
        next: {tags: ['/users/status'], revalidate: 300},
    });
}
