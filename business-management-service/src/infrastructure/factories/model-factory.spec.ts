// 1. DECLARE the mock functions using 'const' (or 'let') at the top level.
// They are initialized as Jest mock functions here.
import { Company } from '@ts/enums'
// Import the class under test
import { ModelFactory } from './model-factory'

const mockGPT4oProvider = jest.fn()
const mockClaudeSonnetProvider = jest.fn()

jest.mock('@infrastructure/providers', () => {
  return {
    GPT4oProvider: function (...args: any[]) {
      return mockGPT4oProvider(...args)
    },
    ClaudeSonnetProvider: function (...args: any[]) {
      return mockClaudeSonnetProvider(...args)
    }
  }
})

describe('ModelFactory tests', () => {
  // Store original environment variables
  const originalEnv = process.env

  beforeEach(() => {
    // Reset process.env for each test
    process.env = { ...originalEnv }

    // Clear all mock history
    jest.clearAllMocks()
    mockGPT4oProvider.mockClear()
    mockClaudeSonnetProvider.mockClear()

    // 3. Set the MOCK IMPLEMENTATION inside beforeEach (where hoisting is not an issue).
    // This allows the mock to be properly instantiated *before* ModelFactory is used.
    mockGPT4oProvider.mockImplementation((apiKey: string) => ({
      apiKey,
      ping: jest.fn(),
      listModels: jest.fn()
    }))
    mockClaudeSonnetProvider.mockImplementation((apiKey: string) => ({
      apiKey,
      ping: jest.fn(),
      listModels: jest.fn()
    }))
  })

  afterAll(() => {
    // Restore the original environment variables after all tests
    process.env = originalEnv
  })

  // --- Factory Method Tests ---

  describe('create tests', () => {
    test('should create a GPT4oProvider instance when company is OPENAI', () => {
      // Arrange
      const mockApiKey = 'mock-openai-key'
      process.env.OPEN_API_KEY = mockApiKey

      // Act
      ModelFactory.create(Company.OPENAI)

      // Assert
      expect(mockGPT4oProvider).toHaveBeenCalledTimes(1)
      expect(mockClaudeSonnetProvider).not.toHaveBeenCalled()
      expect(mockGPT4oProvider).toHaveBeenCalledWith(mockApiKey)
    })

    test('should create a ClaudeSonnetProvider instance when company is ANTHROPIC', () => {
      // Arrange
      const mockApiKey = 'mock-anthropic-key'
      process.env.ANTHROPIC_API_KEY = mockApiKey

      // Act
      ModelFactory.create(Company.ANTHROPIC)

      // Assert
      expect(mockClaudeSonnetProvider).toHaveBeenCalledTimes(1)
      expect(mockGPT4oProvider).not.toHaveBeenCalled()
      expect(mockClaudeSonnetProvider).toHaveBeenCalledWith(mockApiKey)
    })

    test('should throw an error for an unknown company name', () => {
      // Arrange
      const unknownCompany = Company['GOOGLE' as any]

      // Act & Assert
      expect(() => {
        ModelFactory.create(unknownCompany)
      }).toThrow(`Unknown company name: ${unknownCompany}`)
    })
  })

  // --- getEnvVar Method Tests (Internal Logic) ---

  describe('getEnvVar (internal error handling)', () => {
    // Spy on the private static method
    const getEnvVarSpy = jest.spyOn(ModelFactory as any, 'getEnvVar')

    test('should throw "Something went wrong" if the API key is missing for OPENAI', () => {
      // Arrange
      delete process.env.OPEN_API_KEY

      // Act & Assert
      expect(() => {
        ModelFactory.create(Company.OPENAI)
      }).toThrow('Something went wrong')

      expect(getEnvVarSpy).toHaveBeenCalledWith('OPEN_API_KEY')
    })

    test('should throw "Something went wrong" if the API key is an empty string for ANTHROPIC', () => {
      // Arrange
      process.env.ANTHROPIC_API_KEY = ''

      // Act & Assert
      expect(() => {
        ModelFactory.create(Company.ANTHROPIC)
      }).toThrow('Something went wrong')
    })

    test('should throw "Something went wrong" if the API key is a whitespace string', () => {
      // Arrange
      process.env.ANTHROPIC_API_KEY = '   '

      // Act & Assert
      expect(() => {
        ModelFactory.create(Company.ANTHROPIC)
      }).toThrow('Something went wrong')
    })
  })
})
