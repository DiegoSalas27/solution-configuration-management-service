import { LLMService } from '@domain/contracts/llm-service'
import { ModelProvider } from '@service/contracts/model-provider'
import { mock, MockProxy } from 'jest-mock-extended'
import { LLMServiceImpl } from './llm-service-impl'
import { Company, Model } from '@ts/enums'
import { LLM } from '@domain/entities/llm'

describe('LLMServiceImpl tests', () => {
  let sut: LLMService
  let aiProvider: MockProxy<ModelProvider>
  const llm = new LLM(Company.OPENAI, Model.GPTG4O)

  beforeAll(() => {
    aiProvider = mock()
    sut = new LLMServiceImpl(aiProvider)
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('checkHealth tests', () => {
    test('Ensure checkHealth throws exception if ai.listModels throws an exception', async () => {
      const nonOperationalError = new Error('Something went wrong')
      aiProvider.listModels.mockRejectedValueOnce(nonOperationalError)
      const promise = sut.checkHealth(llm)
      await expect(promise).rejects.toThrow('Something went wrong')
      await expect(promise).rejects.toThrow(Error)
      expect(aiProvider.listModels).toHaveBeenCalledTimes(1)
    })

    test('Ensure checkHealth throws exception if ai.ping throws an exception', async () => {
      const nonOperationalError = new Error('Something went wrong')
      aiProvider.ping.mockRejectedValueOnce(nonOperationalError)
      const promise = sut.checkHealth(llm)
      await expect(promise).rejects.toThrow('Something went wrong')
      await expect(promise).rejects.toThrow(Error)
      expect(aiProvider.ping).toHaveBeenCalledTimes(1)
    })

    test('Ensure checkHealth completes successfully if health checks pass', async () => {
      const response = await sut.checkHealth(llm)
      expect(response).toBeUndefined()
      expect(aiProvider.listModels).toHaveBeenCalledTimes(1)
      expect(aiProvider.ping).toHaveBeenCalledTimes(1)
    })
  })
})
