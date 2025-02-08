import {setRequestLocale} from 'next-intl/server';
import {routing} from '../../../i18n/routing';
import ServerListPage from '../../../components/organisms/ServerListPage';
import type {LocaleParams} from './layout';

type PageProps = {
    params: Promise<LocaleParams>;
};

export async function generateStaticParams() {
    const locales = routing.locales as readonly LocaleParams['locale'][];
    return locales.map((locale) => ({locale}));
}

// default locale page as well as server list
async function Page({params}: PageProps) {
    const locale = (await params).locale;
    setRequestLocale(locale);

    return <ServerListPage />;
}

export default Page;
