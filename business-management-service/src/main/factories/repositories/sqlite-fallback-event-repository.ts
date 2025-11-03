import { sqliteDbConnectionManager } from '@infrastructure/db'
import { SQLiteFallBackEventRepository } from '@infrastructure/repositories'
import { FallBackEventRepository } from '@service/contracts'

export const makeSQLiteFallBackEventRepository = (): FallBackEventRepository => {
  return new SQLiteFallBackEventRepository(sqliteDbConnectionManager.getDbInstance())
}
