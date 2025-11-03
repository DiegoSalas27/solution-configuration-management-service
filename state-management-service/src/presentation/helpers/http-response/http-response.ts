/**
 * An class that builds the object for an http response.
 */
export class HttpResponse {
  private timestamp: string
  private reason: string
  private message: string
  private developerMessage: string
  private body: any

  private constructor() {}

  private static builder(): HttpResponse {
    return new HttpResponse()
  }

  private setTimestamp(timestamp: string): HttpResponse {
    this.timestamp = timestamp
    return this
  }

  getTimeStamp() {
    return this.timestamp
  }

  private setBody(body: any): HttpResponse {
    this.body = body
    return this
  }

  getBody() {
    return this.body
  }

  private setMessage(message: any): HttpResponse {
    this.message = message
    return this
  }

  getMessage() {
    return this.message
  }

  private setReason(reason: any): HttpResponse {
    this.reason = reason
    return this
  }

  getReason() {
    return this.reason
  }

  private setDeveloperMessage(developerMessage: any): HttpResponse {
    this.developerMessage = developerMessage
    return this
  }

  getDeveloperMessage() {
    return this.developerMessage
  }

  /**
   * Builds the body for an http response for a client.
   * @param timeStamp Timestamp at which the http request was executed.
   * @param body An object that contains the http reponse data.
   * @param message A message to be sent along with the body.
   * @returns A {@link HttpResponse}
   */
  static build(timeStamp: string, body: any, message: string): HttpResponse

  /**
   * Builds the body for an http response for a developer. It should be used in development mode
   * to troubleshoot issues with the app during integration tests. It should also be used in production,
   * but with caution to never log sensitive information, only log what can be logged for troubleshooting
   * purposes.
   * @param timeStamp Timestamp at which the http request was executed.
   * @param body An object that contains the http reponse data.
   * @param message A message to be sent along with the body.
   * @param reason A reason for why the request failed.
   * @param developerMessage The text that contains the stacktrace of an error.
   * @returns A {@link HttpResponse}
   */
  static build(
    timeStamp: string,
    body: any,
    message: string,
    reason: string,
    developerMessage: string
  ): HttpResponse

  /**
   * Reroutes the API invocation to the proper build method (for clients and developers)
   * @param timeStamp Timestamp at which the http request was executed.
   * @param body An object that contains the http reponse data.
   * @param message A message to be sent along with the body.
   * @param reason A reason for why the request failed.
   * @param developerMessage The text that contains the stacktrace of an error.
   * @returns A {@link HttpResponse}
   */
  static build(
    timeStamp: string,
    body: any,
    message: string,
    reason?: string,
    developerMessage?: string
  ): HttpResponse {
    if (reason !== undefined) {
      return HttpResponse.builder()
        .setTimestamp(timeStamp)
        .setBody(body)
        .setMessage(message)
        .setReason(reason)
        .setDeveloperMessage(developerMessage)
    } else {
      return HttpResponse.builder().setTimestamp(timeStamp).setBody(body).setMessage(message)
    }
  }
}
