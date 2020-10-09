module.exports = {
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    globalSetup: '<rootDir>/jest.global.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    },
};
