/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.ts?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    '@/([^\\.]*)$': '<rootDir>/$1',
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './dist/coverage',
        filename: 'index.html',
        openReport: false,
      },
    ],
  ],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
}
