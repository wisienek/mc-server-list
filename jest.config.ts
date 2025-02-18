import {getJestProjectsAsync} from '@nx/jest';

export default async () => ({
    projects: await getJestProjectsAsync(),
    resolver: '@nx/jest/plugins/resolver',
    collectCoverage: true,
    setupFiles: ['<rootDir>/jest-setup.ts'],
});
