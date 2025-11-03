import { GPT4oProvider } from './index'
import OpenAI from 'openai'
import { MockProxy, mock } from 'jest-mock-extended'

// 1. Define the mock types for the internal SDK interfaces
// Note: OpenAI SDK structure is slightly different from Anthropic
type MockedModels = MockProxy<OpenAI['models']>
type MockedChat = MockProxy<OpenAI['chat']>
type MockedCompletions = MockProxy<OpenAI['chat']['completions']>

// 2. Define our mocks at the module level (must start with 'mock' for hoisting)
const mockModels = mock<MockedModels>()
const mockCompletions = mock<MockedCompletions>()

// Create a mock for the chat object to hold the completions mock
const mockChat: MockProxy<MockedChat> = mock<MockedChat>()
mockChat.completions = mockCompletions

// 3. Mock the OpenAI module/class constructor
// This replaces the actual 'new OpenAI({ apiKey })' call inside the provider.
jest.mock('openai', () => {
  // Return a constructor factory function
  return jest.fn(() => ({
    // Inject our jest-mock-extended mocks into the instance
    models: mockModels,
    chat: mockChat
  }))
})

// Cast the hoisted mock to a Jest Mock Function for assertions
const MockOpenAI = OpenAI as unknown as jest.Mock

describe('GPT4oProvider (Constructor Mock)', () => {
  let provider: GPT4oProvider

  // Spy on console.log to prevent pollution and check output
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    // Clear mock history before each test
    MockOpenAI.mockClear()
    mockModels.list.mockClear()
    mockCompletions.create.mockClear()
    consoleLogSpy.mockClear()

    // Instantiate the provider, which now calls the mocked OpenAI constructor
    provider = new GPT4oProvider('TEST_API_KEY')
  })

  afterAll(() => {
    // Restore the original console.log implementation
    consoleLogSpy.mockRestore()
  })

  // --- Constructor Test ---
  describe('constructor', () => {
    it('should instantiate the OpenAI client with the provided API key', () => {
      // Assert the mocked constructor was called correctly
      expect(MockOpenAI).toHaveBeenCalledTimes(1)
      expect(MockOpenAI).toHaveBeenCalledWith({
        apiKey: 'TEST_API_KEY'
      })
    })
  })

  // --- listModels Test ---
  describe('listModels', () => {
    it('should call client.models.list() and log the model data', async () => {
      // Arrange
      const mockResponse = {
        data: [{ id: 'gpt-4o' }, { id: 'gpt-3.5-turbo' }],
        object: 'list' as const
      }

      // Configure the mock to resolve with the desired response
      mockModels.list.mockResolvedValue(mockResponse as any)

      // Act
      await provider.listModels()

      // Assert
      // 1. Verify that the correct API method was called
      expect(mockModels.list).toHaveBeenCalledTimes(1)
      expect(mockModels.list).toHaveBeenCalledWith()

      // 2. Verify that the result was logged to the console
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[GPT4oProvider] available models: ',
        mockResponse.data
      )
    })
  })

  // --- ping Test ---
  describe('ping', () => {
    it('should call client.chat.completions.create with correct parameters and log the response', async () => {
      // Arrange
      const expectedCreateArgs = {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1
      }

      const mockPingResponse: OpenAI.Chat.Completions.ChatCompletion = {
        id: 'chatcmpl-01...',
        object: 'chat.completion',
        created: 1677652800,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'hi',
              refusal: null
            },
            logprobs: null,
            finish_reason: 'length'
          }
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 }
      }

      // Configure the mock to resolve with the desired response
      mockCompletions.create.mockResolvedValue(mockPingResponse)

      // Act
      await provider.ping()

      // Assert
      // 1. Verify that the correct deep API method was called
      expect(mockCompletions.create).toHaveBeenCalledTimes(1)

      // 2. Verify the arguments passed to completions.create()
      expect(mockCompletions.create).toHaveBeenCalledWith(expectedCreateArgs)

      // 3. Verify that the response was logged to the console
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[GPT4oProvider] ping response: ',
        mockPingResponse
      )
    })
  })
})
