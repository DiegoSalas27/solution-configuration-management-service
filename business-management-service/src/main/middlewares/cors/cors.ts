import { NextFunction, Request, Response } from 'express'

/**
 * Configures the response headers of an HTTP response to enable Cross-Origin Resource Sharing (CORS)
 * @param req A {@link Request}
 * @param res A {@link Response}
 * @param next A {@link NextFunction}
 */
export const cors = (req: Request, res: Response, next: NextFunction): void => {
  /**
   * tells the browser which origins (domains, protocols, and ports) are allowed to access the
   * requested resource. By setting it to *, you're indicating that any origin is allowed to
   * access the resource.
   */
  res.set('access-control-allow-origin', '*')
  /**
   * Specifies which HTTP headers are allowed to be used during the actual request from a
   * cross-origin source. Using * indicates that any header is allowed.
   */
  res.set('access-control-allow-headers', '*')
  /**
   * Indicates which HTTP methods (like GET, POST, PUT, DELETE, etc.) are allowed when accessing
   * the resource from a cross-origin source. Using * indicates that any HTTP method is allowed.
   */
  res.set('access-control-allow-methods', '*')
  next()
}
