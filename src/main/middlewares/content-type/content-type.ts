import { NextFunction, Request, Response } from 'express'

/**
 * Sets content type response to json.
 * @param req A {@link Request}
 * @param res A {@link Response}
 * @param next A {@link NextFunction}
 */
export const contentType = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}
