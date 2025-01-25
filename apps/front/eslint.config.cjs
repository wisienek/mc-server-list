const js = require('@eslint/js');
const nxPlugin = require('@nx/eslint-plugin');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
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
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    allow: ['@front/*'],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
];
