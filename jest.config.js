/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': [
            'babel-jest',
            {
                presets: ['@babel/preset-env'],
                plugins: [['@babel/transform-runtime']],
            },
        ],
    },
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules'],
    moduleFileExtensions: ['ts', 'js'],
    coverageReporters: ['json', 'lcov', 'html'],
};
