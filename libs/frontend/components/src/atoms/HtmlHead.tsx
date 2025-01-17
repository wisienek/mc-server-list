'use client';
import {type ReactNode, useMemo} from 'react';
import Head from 'next/head';

export type PageSeo = {
    title?: string;
    description?: string;
};

type HtmlHeadProps = {
    seo?: PageSeo;
    children?: ReactNode;
};

const HtmlHead = ({seo = {}, children}: HtmlHeadProps) => {
    const title = seo?.title || 'Some site title';
    const metas = useMemo(
        () =>
            [
                ['og:title', title],
                ['description', seo?.description],
                ['og:description', seo?.description],
                ['og:type', 'website'],
                ['referrer', 'origin'],
                [
                    'viewport',
                    'width=device-width,initial-scale=1.0,viewport-fit=cover',
                ],
                ['theme-color', '#000000'],
                ['apple-mobile-web-app-status-bar-style', 'black-translucent'],
            ].filter(([_, content]) => Boolean(content)),
        [seo, title],
    );

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{title}</title>

            {metas.map(([name, content]) => (
                <meta key={name} name={name} content={content} />
            ))}

            {children}
        </Head>
    );
};

export default HtmlHead;
