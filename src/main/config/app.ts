import { sqliteDbConnectionManager } from '@infrastructure/db/sqlite-db-connection-manager'
import setupMiddlewares from '@main/config/middlewares'
import setupRoutes from '@main/config/routes'
import 'dotenv/config'
import express, { Express } from 'express'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type http from 'http'

/**
 * Initializes the server, fetching tenant configurations, creation connection pools per tenant,
 * setting up middlewares and route handlers for express, before the server listen for connections
 * @returns A {@link http.Server}
 */
export const bootstrap = async (): Promise<Express> => {
  const app = express()

  await sqliteDbConnectionManager.initializeLocalDatabase('app.sqlite')

  setupMiddlewares(app)
  setupRoutes(app)
  return app
}
