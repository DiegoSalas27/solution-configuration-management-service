import { LLMService } from '@domain/contracts/llm-service'
import { ModelProvider } from '@service/contracts/model-provider'
import { LLMServiceImpl } from '@service/impl/llm-service-impl'
import { makeSQLiteLLMRepository } from '../repositories'

export const makeLLMService = (modelProvider: ModelProvider): LLMService => {
  return new LLMServiceImpl(modelProvider, makeSQLiteLLMRepository())
}
