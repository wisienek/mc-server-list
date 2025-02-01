export default {
    displayName: 'server',
    preset: '../../jest.preset.js',
    setupFiles: ['../../jest-setup.ts'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.spec.json'}],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/server',
};
