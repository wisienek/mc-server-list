import {getRequestConfig} from 'next-intl/server';

import {routing} from './routing';

async function loadTranslations(locale: string) {
    const translations: Record<string, any> = {};

    try {
        const appTranslations = (await import(`../messages/${locale}/index.json`))
            .default;
        Object.assign(translations, appTranslations);
    } catch (error) {
        console.error(`Failed to load translations from app messages`, error);
    }

    return translations;
}

export default getRequestConfig(async ({requestLocale}) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    const messages = await loadTranslations(locale);

    return {
        locale,
        timeZone: 'Europe/Warsaw',
        messages: messages,
    };
});
