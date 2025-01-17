
module.exports = {
    locales: ['pl', 'en', 'de', 'fr', 'it'],
    defaultLocale: 'en',
    localeDetection: true,
    prefixDefault: true,
    logBuild: false,
    pagesInDir: process.env['PAGES_IN_DIR'] ?? '/app',
    pages: {
        '*': [
            'settings',
        ],
    },
};
