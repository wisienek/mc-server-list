import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

const routing = defineRouting({
    locales: ['pl', 'en', 'de', 'fr', 'it'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: true,
    localeCookie: {
        name: 'NEXT_LOCALE',
        path: '/',
    },
});

type AvailableLocales = (typeof routing.locales)[number];

const {Link, redirect, usePathname, useRouter, getPathname} =
    createNavigation(routing);

export {
    Link,
    redirect,
    usePathname,
    useRouter,
    getPathname,
    routing,
    type AvailableLocales,
};
