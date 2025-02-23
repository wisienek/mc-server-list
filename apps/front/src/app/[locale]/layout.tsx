import NotificationsContainer from '@lib/front/components/organisms/NotificationCenter';
import ThemingProvider from '@lib/front/components/organisms/theme/ThemingProvider';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {Fira_Mono, Inter, Jersey_15} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import type {ReactElement} from 'react';
import NoScriptMessage from '@front/components/molecules/NoScriptMessage';
import Navbar from '@front/components/molecules/Navbar';
import {routing} from '@front/i18n/routing';
import StyledTemplateBody from '@front/components/atoms/StyledTemplateBody';
import Footer from '@front/components/molecules/Footer';

import 'dayjs/locale/pl';
import 'dayjs/locale/en';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';

import './global.css';

export type LocaleParams = {
    locale: 'pl' | 'en' | 'de' | 'fr' | 'it';
};

export type LocaleLayoutProps = {
    children: ReactElement;
    modal: ReactElement;
    params: Promise<LocaleParams>;
};

const jerseyFont = Jersey_15({
    display: 'swap',
    subsets: ['latin'],
    fallback: ['Courier New', 'monospace'],
    weight: '400',
});

const interFont = Inter({
    variable: '--font-inter',
    display: 'fallback',
    subsets: ['latin'],
    fallback: ['Arial', 'sans-serif'],
});

const firaMonoFont = Fira_Mono({
    variable: '--font-fira-mono',
    weight: ['400', '700'],
    display: 'fallback',
    subsets: ['latin'],
    fallback: ['Courier New', 'monospace'],
});

export const metadata = {
    metadataBase: new URL('https://my-minecraft-servers.com'),
    title: {
        default: 'Minecraft Server List - post your own server and vote on them!',
        template: '%s - Minecraft Server',
    },
    description:
        'Add Your own server to our list and vote on best Minecraft Servers. Using native APIs get a detailed info about each minecraft server.',
    openGraph: {
        title: 'Minecraft Server List - post your own server and vote on them!',
        description:
            'Easily and quickly add servers to a list and vote on the best ones!',
        url: '/',
        siteName: 'Minecraft Server List',
        images: [
            {
                url: '/img/icon.png',
                width: 300,
                height: 300,
            },
        ],
        locale: 'en',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: [
            {url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
            {url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
            {
                url: '/img/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        apple: [
            {url: '/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png'},
        ],
        other: [],
    },
    manifest: '/site.webmanifest',
    alternates: {
        canonical: '/',
    },
};

export const viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#E6E6E6'},
        {media: '(prefers-color-scheme: dark)', color: '#111111'},
    ],
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

async function LocaleLayout({children, modal, params}: LocaleLayoutProps) {
    const {locale} = await params;
    if (!routing.locales.includes(locale as never)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages({locale});

    return (
        <html
            className={`dark ${jerseyFont.className} ${interFont.className} ${firaMonoFont.className}`}
        >
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ThemingProvider>
                        <StyledTemplateBody>
                            <Navbar />
                            <NoScriptMessage />
                            <div id="modal-root" />
                            {children}
                            {modal}
                            <NotificationsContainer />
                            <Footer />
                        </StyledTemplateBody>
                    </ThemingProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export default LocaleLayout;
