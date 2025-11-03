import { ResponseEntity } from '@presentation/helpers'
import { CompositeValidator } from 'coffeeless-schema-validators'

/**
 * Defines a single point of entry to every controller class through a handle method. This interface
 * facilitates extending the behavior of controller to add arbitrary decorators.
 */
export interface Controller {
  /**
   * Point of entry to a controller that executes a specified handler with the handler's input and
   * a validation scheme.
   * @param request An object with the request payload to execute a given handler.
   * @param handler A string that is named after the handler method to invoke.
   * @param validation A {@link CompositeValidator}
   * @returns A {@link ResponseEntity}
   */
  handle: (request: any, handler: any, validation: CompositeValidator) => Promise<ResponseEntity>
}

/**
 * An implementation of a {@link Controller} that can be extended by other controllers.
 */
export class BaseController implements Controller {
  async handle(
    request: any,
    handler: any,
    validation: CompositeValidator
  ): Promise<ResponseEntity> {
    return await this[handler](request, validation)
  }
}
