import {CookiesProvider} from 'next-client-cookies/server';
import Providers from '../../components/atoms/Providers';

export default async function RootLayout({children}) {
    return (
        <CookiesProvider>
            <Providers>{children}</Providers>
        </CookiesProvider>
    );
}
