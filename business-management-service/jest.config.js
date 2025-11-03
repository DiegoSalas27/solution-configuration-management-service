module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts)',
    '!**/*d.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/domain/entities/**/*.(ts)',
    '!<rootDir>/src/main/**/*.(ts)'
  ],
  coverageThreshold: {
    global: {
      branches: 50.01,
      functions: 50.47,
      lines: 50.6,
      statements: 50.03
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