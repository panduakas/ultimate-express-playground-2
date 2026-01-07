const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/app/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/tests/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics: false }]
  }
};
export default config;
