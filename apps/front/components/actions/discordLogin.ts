'use server';

import {CookieNames} from '@shared/enums';

export async function discordLogin(code: string): Promise<string> {
    const headers = new Headers({});
    headers.append('Content-Type', 'application/json');

    const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login?code=${code}`,
        {headers, credentials: 'include', next: {tags: ['/users/login-code']}},
    );

    return fetchResponse.headers
        .getSetCookie()
        .find((i) => i.includes(CookieNames.SESSION_ID));
}
