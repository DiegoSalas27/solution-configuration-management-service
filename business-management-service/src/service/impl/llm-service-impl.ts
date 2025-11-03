import { LLM } from '@domain/entities/llm'
import { InternalServerError } from '@domain/errors'
import { LLMRepository } from '@service/contracts'
import { ModelProvider } from '@service/contracts/model-provider'
import { Model } from '@ts/enums'
import { LLMService } from 'domain/contracts/llm-service'

export class LLMServiceImpl implements LLMService {
  constructor(
    private readonly modelProvider: ModelProvider,
    private readonly llmRepository: LLMRepository
  ) {}

  async checkHealth(llm: LLM): Promise<void> {
    try {
      // uncomment below to force a fallback event creation.

      // if (llm.getModel() === Model.CLAUDE_SONNET_4_5) {
      //   throw new Error('Forced exception')
      // }

      console.log(`[Health check] Listing models for ${llm.getCompany()}`)
      await this.modelProvider.listModels()
      console.log(`[Health check] prompting model for ${llm.getCompany()}`)
      await this.modelProvider.ping(llm.getModel())
    } catch (error: any) {
      // If an error is thrown the model might be unavailable, it could also mean that the credentials
      // are invalid, or we have reached the service quota.
      throw new InternalServerError(error)
    }
  }

  async getLLMs(): Promise<LLM[]> {
    return await this.llmRepository.getLLMs()
  }
}
