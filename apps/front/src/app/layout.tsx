import Providers from '@front/components/atoms/Providers';
import {ReactQueryClientProvider} from '@lib/front/components/atoms/ReactQueryClientProvider';
import {CookiesProvider} from 'next-client-cookies/server';

export default async function RootLayout({children}) {
    return (
        <ReactQueryClientProvider>
            <CookiesProvider>
                <Providers>{children}</Providers>
            </CookiesProvider>
        </ReactQueryClientProvider>
    );
}
