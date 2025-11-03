import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

/**
 * Reads iteratively all the route files and adds route handlers to the express {@link Router}
 */
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(join(__dirname, '../routes')).map(async file => {
    if (!file.endsWith('.map') && !file.includes('.test.')) {
      ;(await import(`../routes/${file}`)).default(router)
    }
  })
}
