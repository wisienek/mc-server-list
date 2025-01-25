'use client';
import {permanentRedirect, usePathname} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {NextLocaleCookieKey} from '@front/consts';
import {routing} from '@front/i18n/routing';

export default function RootPage() {
    const locales = routing.locales;

    const pathName = usePathname();

    const startsWith = locales.some(
        (locale) => pathName.startsWith(locale) || pathName.startsWith(`/${locale}`),
    );

    if (startsWith) {
        return;
    }

    const defaultLocale = routing.defaultLocale;
    const cookieStore = useCookies();

    let localeCookie = cookieStore.get(Symbol.keyFor(NextLocaleCookieKey));
    if (!localeCookie || !(locales as unknown as string[]).includes(localeCookie)) {
        cookieStore.set(localeCookie, defaultLocale);

        localeCookie = defaultLocale;
    }

    permanentRedirect(`/${localeCookie ?? defaultLocale}`);
}
