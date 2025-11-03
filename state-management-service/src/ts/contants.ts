import { Company, Model } from './enums'

type CompanyModel = Record<Company, Model[]>

/**
 * Company to Model mapper.
 */
export const COMPANY_MODELS: CompanyModel = {
  openai: [Model.GPTG4O],
  anthropic: [Model.CLAUDE_SONNET_4_5]
}
