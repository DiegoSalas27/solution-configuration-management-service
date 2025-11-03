import { Model } from '@ts/enums'

/**
 * Provides a model.
 */
export interface ModelProvider {
  /**
   * List models from a company.
   * @returns list of models.
   */
  listModels: () => Promise<void>
  /**
   * Submits a dummy cheap prompt to an LLM to ensure a response is given back.
   */
  ping: (model: Model) => Promise<void>
}
