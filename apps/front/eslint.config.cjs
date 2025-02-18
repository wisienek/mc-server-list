const js = require('@eslint/js');
const nxPlugin = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');

module.exports = [
    js.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@nx': nxPlugin,
        },
        settings: {
            'import/resolver': {
                alias: {
                    map: [['@front', './']],
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
        rules: {},
    },
];
