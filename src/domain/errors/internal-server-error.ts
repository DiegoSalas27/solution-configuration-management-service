/**
 * Logs developer errors capturing stack trace to be in the main layer to create errors with full stack trace
 * for developers.
 */
export class InternalServerError extends Error {
  public readonly developerError: Error

  constructor(originalError: Error) {
    super(originalError.message)

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.developerError = originalError
  }

  get fullStackTrace(): string {
    return `${this.stack}\n Caused by: ${this.developerError.stack}`
  }
}
