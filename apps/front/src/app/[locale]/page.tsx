import {setRequestLocale} from 'next-intl/server';
import {routing} from '@front/i18n/routing';
import ServerListPage from '@front/components/organisms/ServerListPage';
import parseSearchParams from '@front/components/helpers/parseURLParams';
import type {LocaleParams} from './layout';

type PageProps = {
    params: Promise<LocaleParams>;
    searchParams: Promise<{[key: string]: string | string[] | undefined}>;
};

export async function generateStaticParams() {
    const locales = routing.locales as readonly LocaleParams['locale'][];
    return locales.map((locale) => ({locale}));
}

// default locale page as well as server list
async function Page({params, searchParams}: PageProps) {
    const locale = (await params).locale;
    setRequestLocale(locale);

    const rawSearchParams = await searchParams;
    const parsedSearchData = parseSearchParams(rawSearchParams);

    return <ServerListPage initialSearchData={parsedSearchData} />;
}

export default Page;
