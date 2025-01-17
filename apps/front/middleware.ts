import {NextRequest, NextResponse} from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.startsWith('/404') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return;
    }

    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
    if (
        !req.nextUrl.pathname.startsWith(`/${locale}`) ||
        req.nextUrl.locale === 'default'
    ) {
        return NextResponse.redirect(
            new URL(
                `/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`,
                req.url,
            ),
        );
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
