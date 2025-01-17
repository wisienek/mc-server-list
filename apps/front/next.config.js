const path = require('path');

const withNextIntl = require('next-intl/plugin')();
const {withNx} = require('@nx/next');

const i18nConfig = require('./i18n');

const ENV = process.env.NEXT_PUBLIC_ENV;

/**
 * @type {import('next').NextConfig}
 */

// https://dev.to/krzysztofzuraw/migrating-nextjs-plugins-from-next-compose-plugins-2gnl
const nextConfig = () => {
    const plugins = [];
    const defaultConfig = {
        reactStrictMode: false,
        trailingSlash: false,
        env: {
            COMMIT_SHA: process.env.CI_COMMIT_SHORT_SHA,
        },
        swcMinify: true,
    };

    return plugins.reduce((acc, next) => next(acc), defaultConfig);
};

module.exports = async (phase, context) => {
    let config = withNx({});
    config = withNextIntl(config);

    config.redirects = function () {
        const localeRedirects = i18nConfig.locales.join('|');

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
