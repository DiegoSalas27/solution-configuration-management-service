import { ModelProvider } from '@service/contracts/model-provider'
import { Company } from '@ts/enums'
import { LLMService } from 'domain/contracts/llm-service'

export class LLMServiceImpl implements LLMService {
  constructor(private readonly ai: ModelProvider) {}

  async checkHealth(model: Company): Promise<void> {
    console.log(`[Health check] Listing models for ${model}`)
    await this.ai.listModels()
    console.log(`[Health check] prompting model for ${model}`)
    await this.ai.ping()
  }
}
