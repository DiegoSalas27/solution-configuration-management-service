import { LLM } from '@domain/entities/llm'
import { ModelFactory } from '@infrastructure/factories'
import { COMPANY_MODELS } from '@ts/contants'
import { Company } from '@ts/enums'
import { makeLLMService } from './factories/services'

const ONE_MINUTE = 60_000

/**
 * continuously monitors the “health” of multiple LLMs used in AI’s simulations.
 */
export function startLLMHealthCheckMonitor() {
  console.log('Starting health check monitor for all LLMs')
  setInterval(() => {
    // iterate through the AI companies
    for (const [company, models] of Object.entries(COMPANY_MODELS)) {
      models.forEach(model => {
        console.log(`${company}-${model} health check`)
        const llm = new LLM(company as Company, model)
        const llmService = makeLLMService(ModelFactory.create(company as Company))
        llmService.checkHealth(llm)
      })
    }
  }, ONE_MINUTE) // run every minute
}
