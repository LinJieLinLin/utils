/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './dist/cove',
  // 当句柄未正常关闭，显式报错
  detectOpenHandles: true,
  forceExit: true,
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
  // extensionsToTreatAsEsm: ['.ts'],
  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //   },
  // },
  collectCoverage: true,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'mjs', 'json', 'jsx', 'ts', 'tsx', 'node'],
}
