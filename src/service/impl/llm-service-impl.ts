import { LLM } from '@domain/entities/llm'
import { ModelProvider } from '@service/contracts/model-provider'
import { LLMService } from 'domain/contracts/llm-service'

export class LLMServiceImpl implements LLMService {
  constructor(private readonly modelProvider: ModelProvider) {}

  async checkHealth(llm: LLM): Promise<void> {
    console.log(`[Health check] Listing models for ${llm.getCompany()}`)
    await this.modelProvider.listModels()
    console.log(`[Health check] prompting model for ${llm.getCompany()}`)
    await this.modelProvider.ping(llm.getModel())
  }
}
