import { randomUUID } from 'crypto'
import sqlite3 from 'sqlite3'

/**
 * Initializes an sqlite database.
 */
export class SQLiteDBConnectionManager {
  private readonly mySQLite: sqlite3.sqlite3
  private db: sqlite3.Database

  constructor() {
    this.mySQLite = sqlite3.verbose()
  }

  /**
   * Creates a database if it does not already exists and seeds master tables.
   * @param dbPath The absolute path to the database file.
   */
  async initializeLocalDatabase(dbPath: string): Promise<void> {
    // Avoid reinitializing database and table if already connected and created.
    if (this.db !== undefined) return
    // Create database from a given dbPath. If database exists it will just open it; else, it will create it.
    const db = new this.mySQLite.Database(dbPath, (error: any) => {
      if (error) {
        console.error('Error opening SQLite database : ', error.message)
        throw error
      } else {
        console.log('Connected to SQLite database.')
      }
    })

    await this.runSQL(db, 'PRAGMA foreign_keys = ON;')

    // Create LLM table
    await this.runSQL(
      db,
      `
      CREATE TABLE IF NOT EXISTS llm (
        id TEXT PRIMARY KEY,
        company INTEGER NOT NULL,
        model INTEGER NOT NULL
      );
    `
    )

    // Create FallBackEvent table (FK to LLM)
    await this.runSQL(
      db,
      `
      CREATE TABLE IF NOT EXISTS fall_back_event (
        id TEXT PRIMARY KEY,
        create_date TEXT NOT NULL,
        llm_id TEXT NOT NULL,
        root_cause TEXT NOT NULL,
        FOREIGN KEY (llm_id) REFERENCES llm(id) ON DELETE CASCADE
      );
    `
    )

    // Create SimulationConfiguration table
    await this.runSQL(
      db,
      `
      CREATE TABLE IF NOT EXISTS simulation_configuration (
        id TEXT PRIMARY KEY,
        primary_model INTEGER NOT NULL,
        secondary_model INTEGER NOT NULL,
        expected_max_latency INTEGER NOT NULL
      );
    `
    )

    console.log('All tables created.')

    await this.seedLLMDefaults(db)

    this.db = db
  }

  private async runSQL(db: sqlite3.Database, command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(command, (err: any) => {
        if (err) {
          console.error('SQLite error:', err.message)
          reject(err)
        } else resolve()
      })
    })
  }

  /**
   * Inserts two default LLM configs if table is empty
   */
  private async seedLLMDefaults(db: sqlite3.Database): Promise<void> {
    const count = await this.getTableCount(db, 'llm')
    if (count > 0) {
      console.log('LLM table already seeded.')
      return
    }

    console.log('Seeding default LLM models...')

    const inserts = [
      { company: 'openai', model: 'gpt-4o' },
      { company: 'anthropic', model: 'claude-sonnet-4-5' }
    ]

    for (const llm of inserts) {
      await this.runSQL(
        db,
        `
        INSERT INTO llm (id, company, model)
        VALUES ('${randomUUID()}', '${llm.company}', '${llm.model}');
      `
      )
    }

    console.log('Default LLM models inserted.')
  }

  private async getTableCount(db: sqlite3.Database, table: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row: any) => {
        if (err) return reject(err)
        resolve(row.count)
      })
    })
  }

  /**
   * Returns an sqlite3 database instance
   * @returns A {@link sqlite3.Database}
   */
  getDbInstance(): sqlite3.Database {
    return this.db
  }

  async closeConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.close((error: any) => {
        if (error) {
          console.error('Failed to close SQLite connection: ', error.message)
          reject(error)
        } else {
          console.log('SQLite connection closed.')
          resolve()
        }
      })
    })
  }
}

export const sqliteDbConnectionManager = new SQLiteDBConnectionManager()
