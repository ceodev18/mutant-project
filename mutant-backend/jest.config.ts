import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    coverageDirectory: '../coverage',
    collectCoverageFrom: ['**/*.ts'],
    coveragePathIgnorePatterns: [
        'main.ts',
        '.module.ts',
        'data-source.ts',
        'config/',
        'migrations/',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};

export default config;
