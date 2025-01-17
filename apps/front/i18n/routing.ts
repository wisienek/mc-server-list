import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

import i18nConfig from '../i18n';

const routing = defineRouting({
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
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
