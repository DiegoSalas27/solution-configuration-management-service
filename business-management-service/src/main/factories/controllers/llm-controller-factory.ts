import { Controller } from '@presentation/contracts'
import { LLMController } from '@presentation/controllers/llm-controller'
import { ModelProvider } from '@service/contracts/model-provider'
import { makeLLMService } from '../services'
import { makeGlobalExceptionHandlerDecorator } from '../decorators'

export const makeLLMController = (modelProvider: ModelProvider): Controller => {
  const controller = new LLMController(makeLLMService(modelProvider))
  return makeGlobalExceptionHandlerDecorator(controller)
}
