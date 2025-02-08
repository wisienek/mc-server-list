import Providers from '@front/components/atoms/Providers';
import {CookiesProvider} from 'next-client-cookies/server';

export default async function RootLayout({children}) {
    return (
        <CookiesProvider>
            <Providers>{children}</Providers>
        </CookiesProvider>
    );
}
