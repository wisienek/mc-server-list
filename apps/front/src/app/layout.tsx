import {CookiesProvider} from 'next-client-cookies/server';

export default async function RootLayout({children}) {
    return <CookiesProvider>{children}</CookiesProvider>;
}
