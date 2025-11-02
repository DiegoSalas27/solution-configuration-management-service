/**
 * Provides a model.
 */
export interface ModelProvider {
  /**
   * List models from a company.
   * @returns list of models.
   */
  listModels: () => Promise<string[]>
  /**
   * Submits a dummy cheap prompt to an LLM to ensure a response is given back.
   */
  ping: () => Promise<void>
}
