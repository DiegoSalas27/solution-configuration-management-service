import { GPT4oProvider } from './index'
import OpenAI from 'openai'
import { MockProxy, mock } from 'jest-mock-extended'
import { Model } from '@ts/enums'

// --- Mocking Setup ---
type MockedModels = MockProxy<OpenAI['models']>
type MockedChat = MockProxy<OpenAI['chat']>
type MockedCompletions = MockProxy<OpenAI['chat']['completions']>

const mockModels = mock<MockedModels>()
const mockCompletions = mock<MockedCompletions>()

// Wire up the nested chat structure
const mockChat: MockProxy<MockedChat> = mock<MockedChat>()
mockChat.completions = mockCompletions

// Mock the OpenAI module/class constructor
jest.mock('openai', () => {
  return jest.fn(() => ({
    // Inject our jest-mock-extended mocks into the instance
    models: mockModels,
    chat: mockChat
  }))
})

const MockOpenAI = OpenAI as unknown as jest.Mock
// --- End Mocking Setup ---

describe('GPT4oProvider', () => {
  let provider: GPT4oProvider
  const TEST_MODEL_ENUM_VALUE = Model.GPTG4O // Use the mock enum for testing

  // Spy on console.log to check output
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    // Clear mock history before each test
    MockOpenAI.mockClear()
    mockModels.list.mockClear()
    mockCompletions.create.mockClear()
    consoleLogSpy.mockClear()

    // Instantiate the provider (calls the mocked constructor)
    provider = new GPT4oProvider('TEST_API_KEY')
  })

  afterAll(() => {
    // Restore the original console.log implementation
    consoleLogSpy.mockRestore()
  })

  // --- Constructor and listModels tests remain the same ---
  test('should instantiate the OpenAI client with the provided API key', () => {
    expect(MockOpenAI).toHaveBeenCalledTimes(1)
    expect(MockOpenAI).toHaveBeenCalledWith({
      apiKey: 'TEST_API_KEY'
    })
  })

  test('should call client.models.list() and log the model data', async () => {
    // Arrange
    const mockResponse = {
      data: [{ id: 'gpt-4o' }, { id: 'gpt-3.5-turbo' }],
      object: 'list' as const
    }

    mockModels.list.mockResolvedValue(mockResponse as any)

    // Act
    await provider.listModels()

    // Assert
    expect(mockModels.list).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[GPT4oProvider] available models: ',
      mockResponse.data
    )
  })

  test('should call client.chat.completions.create and use the passed Model enum value', async () => {
    // Arrange
    const expectedCreateArgs = {
      // **KEY CHANGE**: The model argument is dynamic based on the enum
      model: TEST_MODEL_ENUM_VALUE,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1
    }

    const mockPingResponse: OpenAI.Chat.Completions.ChatCompletion = {
      id: 'chatcmpl-01...',
      object: 'chat.completion',
      created: 1677652800,
      model: TEST_MODEL_ENUM_VALUE, // Ensure the response reflects the mock model
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

    // Configure the mock to resolve
    mockCompletions.create.mockResolvedValue(mockPingResponse)

    // Act
    // **KEY CHANGE**: Pass the mock enum value to the ping method
    await provider.ping(TEST_MODEL_ENUM_VALUE)

    // Assert
    // 1. Verify the correct API method was called
    expect(mockCompletions.create).toHaveBeenCalledTimes(1)

    // 2. Verify the arguments, confirming the passed model was used
    expect(mockCompletions.create).toHaveBeenCalledWith(expectedCreateArgs)

    // 3. Verify the result was logged
    expect(consoleLogSpy).toHaveBeenCalledWith('[GPT4oProvider] ping response: ', mockPingResponse)
  })
})
