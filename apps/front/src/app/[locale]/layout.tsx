import {getMessages, setRequestLocale} from 'next-intl/server';
import {Fira_Mono, Inter} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {type ReactNode} from 'react';
import NoScriptMessage from '@front/components/molecules/no-script-message/NoScriptMessage';
import Navbar from '@front/components/molecules/navbar/Navbar';
import {routing} from '@front/i18n/routing';

import './global.css';

export type LocaleParams = {
    locale: 'pl' | 'en' | 'de' | 'fr' | 'it';
};

export type LocaleLayoutProps = {
    children: ReactNode;
    params: Promise<LocaleParams>;
};

const interFont = Inter({
    variable: '--font-inter',
    display: 'swap',
    subsets: ['latin'],
    fallback: ['Arial', 'sans-serif'],
});

const firaMonoFont = Fira_Mono({
    variable: '--font-fira-mono',
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin'],
    fallback: ['Courier New', 'monospace'],
});

// TODO: change url
export const metadata = {
    metadataBase: new URL('https://minecraft-server-list.com'),
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
                url: '/img/android-chrome-36x36.png',
                sizes: '36x36',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-48x48.png',
                sizes: '48x48',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-72x72.png',
                sizes: '72x72',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-96x96.png',
                sizes: '96x96',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-144x144.png',
                sizes: '144x144',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-256x256.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                url: '/img/android-chrome-384x384.png',
                sizes: '384x384',
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
            {
                url: '/img/apple-touch-icon-57x57.png',
                sizes: '57x57',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-60x60.png',
                sizes: '60x60',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-72x72.png',
                sizes: '72x72',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-76x76.png',
                sizes: '76x76',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-114x114.png',
                sizes: '114x114',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-120x120.png',
                sizes: '120x120',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
            },
            {
                url: '/img/apple-touch-icon-180x180.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-57x57-precomposed.png',
                sizes: '57x57',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-60x60-precomposed.png',
                sizes: '60x60',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-72x72-precomposed.png',
                sizes: '72x72',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-76x76-precomposed.png',
                sizes: '76x76',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-114x114-precomposed.png',
                sizes: '114x114',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-120x120-precomposed.png',
                sizes: '120x120',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-144x144-precomposed.png',
                sizes: '144x144',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-152x152-precomposed.png',
                sizes: '152x152',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/img/apple-touch-icon-180x180-precomposed.png',
                sizes: '180x180',
            },
            {rel: 'mask-icon', url: '/img/safari-pinned-tab.svg', color: '#303030'},
        ],
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

async function LocaleLayout({children, params}: LocaleLayoutProps) {
    const {locale} = await params;
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages({locale});

    return (
        <html className={`dark ${interFont.className} ${firaMonoFont.className}`}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    <NoScriptMessage />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export default LocaleLayout;
