import { HttpStatusCode } from '@presentation/enums'
import { HttpResponse } from '../http-response/http-response'

/**
 * The http response to be sent through the http server with the status code of the response.
 */
export class ResponseEntity {
  private _body: HttpResponse
  private constructor(private readonly _statusCode: number) {}

  public body(body: HttpResponse) {
    this._body = body
    return this
  }

  public statusCode() {
    return this._statusCode
  }

  public getHttpResponseBody() {
    return this._body
  }

  /**
   * Adds 200 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static ok() {
    return new ResponseEntity(HttpStatusCode.ok)
  }

  /**
   * Adds 400 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static badRequest() {
    return new ResponseEntity(HttpStatusCode.badRequest)
  }

  /**
   * Adds 500 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static internalServerError() {
    return new ResponseEntity(HttpStatusCode.serverError)
  }

  /**
   * Adds 204 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static noContent() {
    return new ResponseEntity(HttpStatusCode.noContent)
  }

  /**
   * Adds 404 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static notFound() {
    return new ResponseEntity(HttpStatusCode.notFound)
  }

  /**
   * Adds 403 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static forbidden() {
    return new ResponseEntity(HttpStatusCode.forbidden)
  }

  /**
   * Adds 401 status code to the response.
   * @returns A {@link ResponseEntity}
   */
  static unauthorized() {
    return new ResponseEntity(HttpStatusCode.unauthorized)
  }
}
