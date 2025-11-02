import { Company } from '@ts/enums'

/**
 * Performs health checks on LLMs
 */
export interface LLMService {
  /**
   * Checks that LLM API is reachable, credentials are valid, and expected responses are received.
   */
  checkHealth: (model: Company) => Promise<void>
}
