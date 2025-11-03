import { ClaudeSonnetProvider } from './index'
import Anthropic from '@anthropic-ai/sdk'
import { MockProxy, mock } from 'jest-mock-extended'

// 1. Define the mock types for the internal SDK interfaces
type MockedModels = MockProxy<Anthropic['models']>
type MockedMessages = MockProxy<Anthropic['messages']>
// We don't need to define a MockedAnthropicClient type here anymore,
// as the constructor mock will provide the instance.

// 2. Define our mocks at the module level (must start with 'mock' for hoisting)
const mockMessages = mock<MockedMessages>()
const mockModels = mock<MockedModels>()

// 3. Mock the Anthropic module/class constructor
// This replaces the actual 'new Anthropic({ apiKey })' call inside the provider.
jest.mock('@anthropic-ai/sdk', () => {
  // Use a class factory that returns an object mimicking the Anthropic client instance
  return jest.fn(() => ({
    models: mockModels, // Inject our jest-mock-extended mock
    messages: mockMessages // Inject our jest-mock-extended mock
  }))
})

// Cast the hoisted mock to a Jest Mock Function for assertions
const MockAnthropic = Anthropic as unknown as jest.Mock

describe('ClaudeSonnetProvider (Constructor Mock)', () => {
  let provider: ClaudeSonnetProvider

  // Spy on console.log to prevent pollution and check output
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    // Clear mock history before each test
    MockAnthropic.mockClear()
    mockModels.list.mockClear()
    mockMessages.create.mockClear()
    consoleLogSpy.mockClear()

    // Instantiate the provider, which now calls the mocked Anthropic constructor
    provider = new ClaudeSonnetProvider('TEST_API_KEY')
  })

  // --- Constructor Test ---
  describe('constructor', () => {
    it('should instantiate the Anthropic client with the provided API key', () => {
      // Assert the mocked constructor was called correctly
      expect(MockAnthropic).toHaveBeenCalledTimes(1)
      expect(MockAnthropic).toHaveBeenCalledWith({
        apiKey: 'TEST_API_KEY'
      })

      // Crucially, it should NOT have received a fetch implementation in this scenario,
      // as the SDK's internal logic that looks for global fetch is now skipped by the mock.
      // We can assert the options object to ensure only the key was passed.
      expect(MockAnthropic.mock.calls[0][0]).toEqual({ apiKey: 'TEST_API_KEY' })
    })
  })

  // --- listModels Test ---
  describe('listModels', () => {
    it('should call client.models.list() and log the model data', async () => {
      // Arrange
      const mockResponse = {
        data: [{ id: 'claude-3-sonnet' }, { id: 'claude-3-opus' }],
        object: 'list' as const,
        url: '/models'
      }

      // Configure the mock to resolve with the desired response
      mockModels.list.mockResolvedValue(mockResponse as any)

      // Act
      await provider.listModels()

      // Assert
      expect(mockModels.list).toHaveBeenCalledTimes(1)
      expect(mockModels.list).toHaveBeenCalledWith()

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[ClaudeSonnetProvider] available models: ',
        mockResponse.data
      )
    })
  })

  // --- ping Test ---
  describe('ping', () => {
    it('should call client.messages.create with correct parameters and log the response', async () => {
      // Arrange
      const expectedCreateArgs = {
        model: 'claude-sonnet-4-5',
        messages: [{ role: 'user', content: 'ping ' }],
        max_tokens: 1
      }

      const mockPingResponse = {
        id: 'msg_01...',
        type: 'message',
        role: 'assistant',
        model: 'claude-sonnet-4-5',
        content: [{ type: 'text', text: 'hi' }],
        usage: { input_tokens: 4, output_tokens: 1 }
      }

      // Configure the mock to resolve with the desired response
      mockMessages.create.mockResolvedValue(mockPingResponse as any)

      // Act
      await provider.ping()

      // Assert
      expect(mockMessages.create).toHaveBeenCalledTimes(1)
      expect(mockMessages.create).toHaveBeenCalledWith(expectedCreateArgs)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[ClaudeSonnetProvider] ping response: ',
        mockPingResponse
      )
    })
  })
})
