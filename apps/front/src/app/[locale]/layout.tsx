import {getMessages, setRequestLocale} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {type ReactNode} from 'react';
import {routing} from '@front/i18n/routing';
import HtmlHead from '@lib/front/components/atoms/HtmlHead';

import '../style.css';

export type LocaleParams = {
    locale: 'pl' | 'en' | 'de' | 'fr' | 'it';
};

export type LocaleLayoutProps = {
    children: ReactNode;
    params: Promise<LocaleParams>;
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
            <HtmlHead seo={pageSeo} />
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </>
    );
}

export default LocaleLayout;
