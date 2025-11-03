import { Controller } from '@presentation/contracts'
import { HttpResponse, ResponseEntity } from '@presentation/helpers'
import { CompositeValidator, ValidationError } from 'coffeeless-schema-validators'

export class GlobalExceptionHandlerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(
    request: any,
    handler: any,
    validation: CompositeValidator
  ): Promise<ResponseEntity> {
    try {
      return await this.controller.handle(request, handler, validation)
    } catch (error: any) {
      const responseTime = new Date().toISOString()

      console.error(error)

      const httpResponse = HttpResponse.build(responseTime, null, error.message)
      if (error instanceof ValidationError) {
        return ResponseEntity.badRequest().body(httpResponse)
      }

      return ResponseEntity.internalServerError().body(httpResponse)
    }
  }
}
