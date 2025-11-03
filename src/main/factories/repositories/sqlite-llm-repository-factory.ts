import { sqliteDbConnectionManager } from '@infrastructure/db'
import { SQLiteLLMRepository } from '@infrastructure/repositories/sqlite-llm-repository'
import { LLMRepository } from '@service/contracts'

export const makeSQLiteLLMRepository = (): LLMRepository => {
  return new SQLiteLLMRepository(sqliteDbConnectionManager.getDbInstance())
}
