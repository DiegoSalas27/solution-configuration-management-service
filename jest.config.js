module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts)',
    '!**/*d.ts',
    '!<rootDir>/src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 83.01,
      functions: 89.47,
      lines: 92.6,
      statements: 92.03
    }
  },
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@domain/(.*)$': '<rootDir>/src/domain/$1',
    '@service/(.*)$': '<rootDir>/src/service/$1',
    '@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '@main/(.*)$': '<rootDir>/src/main/$1',
    '@ts/(.*)$': '<rootDir>/src/ts/$1'
  },
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}