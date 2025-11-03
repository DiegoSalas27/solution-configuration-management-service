import { adaptRoute } from '@main/adapters'
import { makeLLMController } from '@main/factories/controllers'
import { makeCheckHealthValidation } from '@main/factories/validators'
import { LLMController } from '@presentation/controllers'
import { Router } from 'express'

const resource = 'llms'

export default (router: Router): void => {
  router.post(
    `/${resource}/check-health`,
    adaptRoute<LLMController.Handler>(makeLLMController, 'checkHealth', makeCheckHealthValidation())
  )
}
