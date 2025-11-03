import { FallBackEvent } from '@domain/entities/fall-back-event'
import { FallBackEventRepository } from '@service/contracts'
import { randomUUID } from 'crypto'
import sqlite3 from 'sqlite3'

export class SQLiteFallBackEventRepository implements FallBackEventRepository {
  constructor(private readonly db: sqlite3.Database) {}

  saveFallBackEvent(fallBackEvent: FallBackEvent): FallBackEvent {
    this.db.run(`
      INSERT INTO fall_back_event (id, create_date, llm_id, root_cause)
      VALUES ('${randomUUID()}', 
      '${fallBackEvent.getCreateDate()}', 
      '${fallBackEvent.getLLM()}', 
      '${fallBackEvent.getRootCause()}');
    `)
    return fallBackEvent
  }
}
