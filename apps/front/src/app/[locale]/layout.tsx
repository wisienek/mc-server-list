import {getMessages, setRequestLocale} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {type ReactNode} from 'react';
import {routing} from '@front/i18n/routing';
import type {Metadata} from 'next';

import '../style.css';

export type LocaleParams = {
    locale: 'pl' | 'en' | 'de' | 'fr' | 'it';
};

export type LocaleLayoutProps = {
    children: ReactNode;
    params: Promise<LocaleParams>;
};

const Head = ({title, description}: Pick<Metadata, 'title' | 'description'>) => {
    return (
        <head>
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicon/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon/favicon-16x16.png"
            />
            <link rel="manifest" href="/favicon/site.webmanifest" />
            <link
                rel="mask-icon"
                href="/favicon/safari-pinned-tab.svg"
                color="#000000"
            />
            <link rel="shortcut icon" href="/favicon/favicon.ico" />
            <meta name="msapplication-TileColor" content="#000000" />
            <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
            <meta name="theme-color" content="#000" />
            <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
            <title>{title}</title>
        </head>
    );
};

async function LocaleLayout({children, params}: LocaleLayoutProps) {
    const {locale} = await params;
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }
    setRequestLocale(locale);
    const messages = await getMessages({locale});
    const pageSeo = messages['page']['seo'];

    return (
        <>
            <Head />
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </>
    );
}

export default LocaleLayout;
