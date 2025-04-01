import {parseResult} from '@core';
import {getUserSetCredentials} from '@front/components/actions/getUserSetCredentials';
import {getUserData} from '@front/components/actions/getUserData';
import {ReactQueryClientProvider} from '@lib/front/components/atoms/ReactQueryClientProvider';
import Providers from '@front/components/atoms/Providers';
import {CookiesProvider} from 'next-client-cookies/server';

export default async function RootLayout({children}) {
    const userResponse = parseResult(await getUserData());
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
