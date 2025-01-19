import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
import {CurrentPathHeader, NextLocaleCookieKey} from '@front/consts';
import {routing} from './i18n/routing';

export default async function middleware(request: NextRequest) {
    const defaultLocale =
        request.headers.get(Symbol.keyFor(NextLocaleCookieKey)) ||
        routing.defaultLocale;

    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(request);

    response.headers.set(Symbol.keyFor(NextLocaleCookieKey), defaultLocale);
    response.headers.set(Symbol.keyFor(CurrentPathHeader), request.nextUrl.pathname);

    return response;
}

export const config = {
    matcher: ['/', '/(de|en|fr|it|pl)/:path*'],
};
