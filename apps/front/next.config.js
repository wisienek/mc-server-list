const path = require('path');

const withNextIntl = require('next-intl/plugin')();
const {withNx} = require('@nx/next');

const ENV = process.env.NEXT_PUBLIC_ENV;

module.exports = async (phase, context) => {
    const defaultConfig = {
        images: {
            domains: ['i.imgur.com', 'imgur.com', 'cdn.minecraft-server-list.com'],
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'cdn.minecraft-server-list.com',
                    port: '',
                    pathname: '/**',
                    search: '',
                },
                {
                    protocol: 'https',
                    hostname: 'i.imgur.com',
                    port: '',
                    pathname: '/**',
                    search: '',
                },
                {
                    protocol: 'https',
                    hostname: 'imgur.com',
                    port: '',
                    pathname: '/**',
                    search: '',
                },
                {
                    protocol: 'https',
                    hostname: '**',
                },
            ],
        },
        reactStrictMode: false,
        trailingSlash: false,
        env: {
            COMMIT_SHA: process.env.CI_COMMIT_SHORT_SHA,
        },
        swcMinify: true,
    };

    let config = withNx(defaultConfig);
    config = withNextIntl(config);

    config.redirects = function () {
        const localeRedirects = ['pl', 'en', 'de', 'fr', 'it'].join('|');

        return [
            {
                source: `/:locale(${localeRedirects})/404`,
                destination: '/404',
                permanent: true,
            },
        ];
    };

    const originalWebpack = config.webpack;
    config.webpack = (webpackConfig, options) => {
        const temp = originalWebpack(webpackConfig, options);

        temp.module.rules.push({
            test: /\.(ttf|woff|woff2)$/,
            type: 'asset/inline',
        });
        delete temp.module.generator['asset'];

        temp.module.rules.push({
            test: /\.svg$/i,
            issuer: {and: [/\.(js|ts|md)x?$/]},
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        prettier: false,
                        svgo: true,
                        svgoConfig: {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {overrides: {removeViewBox: false}},
                                },
                            ],
                        },
                        titleProp: true,
                    },
                },
            ],
        });

        return temp;
    };

    config.output = 'standalone';
    config.outputFileTracingRoot = path.join(__dirname, '../../');
    config.productionBrowserSourceMaps = false;
    return config;
};
