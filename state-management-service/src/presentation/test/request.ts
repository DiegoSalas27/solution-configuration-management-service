import { CheckHealthDto } from '@presentation/dtos'
import { Company, Model } from '@ts/enums'

export const mockHealthCheckRequest = (): CheckHealthDto => ({
  company: Company.OPENAI,
  model: Model.GPTG4O
})
