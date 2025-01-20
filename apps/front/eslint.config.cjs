module.exports = {
    root: true,
    extends: ['next/core-web-vitals', 'eslint:recommended'],
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
        'no-restricted-imports': [
            'error',
            {
                patterns: ['../*', './*'],
                message:
                    'Use module imports like "@front/..." instead of relative paths.',
            },
        ],
        'import/no-unresolved': 'error',
    },
};
