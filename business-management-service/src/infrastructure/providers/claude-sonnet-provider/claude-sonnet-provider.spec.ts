// NOTE: You would need to ensure the actual Model enum is available or mocked in your test environment.
// For this example, we define it here for context.

import { ClaudeSonnetProvider } from './index'
import Anthropic from '@anthropic-ai/sdk'
import { Model } from '@ts/enums'
import { MockProxy, mock } from 'jest-mock-extended'

// --- Mocking Setup ---
type MockedModels = MockProxy<Anthropic['models']>
type MockedMessages = MockProxy<Anthropic['messages']>

const mockMessages = mock<MockedMessages>()
const mockModels = mock<MockedModels>()

// Mock the Anthropic module/class constructor
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn(() => ({
    models: mockModels,
    messages: mockMessages
  }))
})

const MockAnthropic = Anthropic as unknown as jest.Mock
// --- End Mocking Setup ---

describe('ClaudeSonnetProvider', () => {
  let provider: ClaudeSonnetProvider
  const TEST_MODEL_ENUM_VALUE = Model.CLAUDE_SONNET_4_5 // Use the mock enum for testing

  // Spy on console.log
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    // Clear mock history
    MockAnthropic.mockClear()
    mockModels.list.mockClear()
    mockMessages.create.mockClear()
    consoleLogSpy.mockClear()

    // Instantiate the provider (calls the mocked constructor)
    provider = new ClaudeSonnetProvider('TEST_API_KEY')
  })

  // ... (listModels and constructor tests remain the same) ...

  describe('listModels', () => {
    test('should call client.models.list() and log the result', async () => {
      // Arrange
      const mockResponse = {
        data: [{ id: 'claude-3-sonnet' }],
        object: 'list' as const,
        url: '/models'
      }
      mockModels.list.mockResolvedValue(mockResponse as any)

      // Act
      await provider.listModels()

      // Assert
      expect(mockModels.list).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[ClaudeSonnetProvider] available models: ',
        mockResponse.data
      )
    })
  })

  describe('ping', () => {
    test('should call client.messages.create and use the passed Model enum value', async () => {
      // Arrange
      const expectedCreateArgs = {
        // **KEY CHANGE**: Expect the model argument to match the passed enum value
        model: TEST_MODEL_ENUM_VALUE,
        messages: [{ role: 'user', content: 'ping ' }],
        max_tokens: 1
      }

      const mockPingResponse = {
        id: 'msg_01...',
        type: 'message',
        role: 'assistant',
        model: TEST_MODEL_ENUM_VALUE,
        content: [{ type: 'text', text: 'hi' }],
        usage: { input_tokens: 4, output_tokens: 1 }
      }

      // Configure the mock to resolve
      mockMessages.create.mockResolvedValue(mockPingResponse as any)

      // Act
      // **KEY CHANGE**: Pass the mock enum value to the ping method
      await provider.ping(TEST_MODEL_ENUM_VALUE)

      // Assert
      // 1. Verify that the correct API method was called
      expect(mockMessages.create).toHaveBeenCalledTimes(1)

      // 2. Verify the arguments passed to messages.create()
      // This assertion ensures the model parameter was used correctly
      expect(mockMessages.create).toHaveBeenCalledWith(expectedCreateArgs)

      // 3. Verify that the response was logged
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[ClaudeSonnetProvider] ping response: ',
        mockPingResponse
      )
    })
  })
})
