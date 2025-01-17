import type {ReactNode} from 'react';
import {routing} from '@front/i18n/routing';
import type {LocaleParams} from './layout';

type PageProps = {
    children: ReactNode;
    params: Promise<LocaleParams>;
};

export async function generateStaticParams() {
    const locales = routing.locales as LocaleParams['locale'][];
    return locales.map((locale) => ({locale}));
}

async function Page({children}: PageProps) {
    return children;
}

export default Page;
