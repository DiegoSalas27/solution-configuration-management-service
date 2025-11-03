import { GlobalExceptionHandlerDecorator } from '@main/decorators/global-exception-handler-decorator'
import { Controller } from '@presentation/contracts'

export const makeGlobalExceptionHandlerDecorator = (controller: Controller): Controller => {
  return new GlobalExceptionHandlerDecorator(controller)
}
