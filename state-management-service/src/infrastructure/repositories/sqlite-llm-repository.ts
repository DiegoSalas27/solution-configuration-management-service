import { LLM } from '@domain/entities/llm'
import { LLMRepository } from '@service/contracts'
import sqlite3 from 'sqlite3'

export class SQLiteLLMRepository implements LLMRepository {
  constructor(private readonly db: sqlite3.Database) {}

  async getLLMs(): Promise<LLM[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM llm', [], (err, rows: any) => {
        if (err) return reject(err)
        resolve(rows.map(row => LLM.fromDbRow(row)))
      })
    })
  }
}
