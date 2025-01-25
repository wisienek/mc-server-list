import type {ReactNode} from 'react';
import {routing} from '@front/i18n/routing';
import type {LocaleParams} from './layout';
import {setRequestLocale} from 'next-intl/server';

type PageProps = {
    children: ReactNode;
    params: Promise<LocaleParams>;
};

export async function generateStaticParams() {
    const locales = routing.locales as readonly LocaleParams['locale'][];
    return locales.map((locale) => ({locale}));
}

async function Page({children, params}: PageProps) {
    const locale = (await params).locale;
    setRequestLocale(locale);

    return children;
}

export default Page;
