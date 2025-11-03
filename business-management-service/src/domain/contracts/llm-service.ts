import { LLM } from '@domain/entities/llm'

/**
 * Performs health checks on LLMs
 */
export interface LLMService {
  /**
   * Checks that LLM API is reachable, credentials are valid, and expected responses are received.
   */
  checkHealth: (llm: LLM) => Promise<void>
  getLLMs: () => Promise<LLM[]>
}
