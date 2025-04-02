import {parseResult} from '@core';
import {getUserSetCredentials} from '@front/components/actions/getUserSetCredentials';
import {getUserData} from '@front/components/actions/getUserData';
import {ReactQueryClientProvider} from '@lib/front/components/atoms/ReactQueryClientProvider';
import Providers from '@front/components/atoms/Providers';
import {CookieNames} from '@shared/enums';
import {CookiesProvider} from 'next-client-cookies/server';
import {cookies} from 'next/headers';

export default async function RootLayout({children}) {
    const sessionCookie = (await cookies()).get(CookieNames.SESSION_ID)?.value;

    const userResponse = parseResult(await getUserData(sessionCookie));
    const loginResponse = parseResult(await getUserSetCredentials());

    const user = userResponse.isOk() ? userResponse.unwrap() : undefined;
    const isFirstLogin = loginResponse.isOk() ? loginResponse.unwrap() : undefined;

    return (
        <ReactQueryClientProvider>
            <CookiesProvider>
                <Providers auth={{user, isFirstLogin}}>{children}</Providers>
            </CookiesProvider>
        </ReactQueryClientProvider>
    );
}
