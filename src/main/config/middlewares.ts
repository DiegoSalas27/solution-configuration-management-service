import { bodyParser, contentType, cors } from '@main/middlewares'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Request, type Response, Express } from 'express'

/**
 * Adds middlewares that will update the {@link Request} and {@link Response} objects from express.
 */
export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
