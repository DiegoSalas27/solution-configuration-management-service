import { LLM } from '@domain/entities/llm'

export interface LLMRepository {
  getLLMs: () => Promise<LLM[]>
}
