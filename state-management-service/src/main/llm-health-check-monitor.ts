import { LLM } from '@domain/entities/llm'
import { ModelFactory } from '@infrastructure/factories'
import { Company } from '@ts/enums'
import { makeLLMService } from './factories/services'
import { InternalServerError } from '@domain/errors'
import { FallBackEvent } from '@domain/entities/fall-back-event'
import { getFormattedTimeStamp } from '@ts/utils'
import { makeSQLiteLLMRepository } from './factories/repositories'
import { makeSQLiteFallBackEventRepository } from './factories/repositories/sqlite-fallback-event-repository'

const ONE_MINUTE = 60_000

/**
 * continuously monitors the “health” of multiple LLMs used in AI’s simulations.
 */
export function startLLMHealthCheckMonitor() {
  setInterval(async () => {
    console.log('Starting health check monitor for all LLMs')
    // iterate through all llms
    const llmRepository = makeSQLiteLLMRepository()
    const llms = await llmRepository.getLLMs()
    for (const llm of llms) {
      const company = llm.getCompany()
      const model = llm.getModel()
      try {
        console.log(`${company}-${model} health check`)
        const llm = new LLM(company as Company, model)
        const llmService = makeLLMService(ModelFactory.create(company as Company))
        await llmService.checkHealth(llm)
      } catch (error: any) {
        if (error instanceof InternalServerError) {
          // if we enter here it means the model service is unhealthy and we should use a secondary model.
          console.log(`${company}-${model} is unhealthy.`)
          // Create fall back event
          const fallbackEvent = new FallBackEvent(
            getFormattedTimeStamp(),
            llm.getId(),
            error.fullStackTrace
          )
          const fallBackEventRepository = makeSQLiteFallBackEventRepository()
          fallBackEventRepository.saveFallBackEvent(fallbackEvent)
          console.log('FallBackEvent saved: ', JSON.stringify(fallbackEvent, null, 2))
        }
      }
    }
  }, ONE_MINUTE) // run every minute
}
