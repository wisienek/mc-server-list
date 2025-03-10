'use server';

import {UserDto} from '@shared/dto';
import {CookieNames} from '@shared/enums';
import {revalidateTag} from 'next/cache';
import {cookies} from 'next/headers';
import parseCookieString from '../helpers/parseCookieString';
import {customFetch} from './baseFetch';

export async function loginUser(data: {
    email: string;
    password: string;
}): Promise<UserDto> {
    return await customFetch<UserDto>(
        `/users/login/credentials`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            next: {tags: ['/users/login/credentials']},
        },
        {
            onSuccess: async ({response}) => {
                const cookie = response.headers
                    .getSetCookie()
                    .find((i) => i.includes(CookieNames.SESSION_ID));

                const cookieStore = await cookies();
                const parsedCookieJSON = parseCookieString(cookie);
                const decodedValue = decodeURIComponent(parsedCookieJSON.value);

                cookieStore.set(parsedCookieJSON.name, decodedValue, {
                    expires: parsedCookieJSON.expires,
                });

                revalidateTag('/users/status');
                revalidateTag('/users/has-credentials');
            },
        },
    );
}
