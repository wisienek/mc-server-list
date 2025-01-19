import {getRequestConfig} from 'next-intl/server';
import {IntlErrorCode} from 'next-intl';

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

    const onError = (error) => {
        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
            console.error(error);
        } else {
            throw error;
        }
    };

    const getMessageFallback = ({namespace, key, error}) => {
        const path = [namespace, key].filter((part) => part != null).join('.');

        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
            return path + ' is not yet translated';
        } else {
            return 'Dear developer, please fix this message: ' + path;
        }
    };

    return {
        onError,
        getMessageFallback,
        timeZone: 'Europe/Warsaw',
        locale,
        messages,
    };
});
