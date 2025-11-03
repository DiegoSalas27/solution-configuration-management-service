import { ModelFactory } from '@infrastructure/factories'
import { ModelProvider } from '@service/contracts/model-provider'
import { CompositeValidator } from 'coffeeless-schema-validators'
import { Request, Response } from 'express'
import { Controller } from 'presentation/contracts'

type HttpRequest = Record<string, object>

/**
 * Adapts express API to the API exposed by the {@link Controller}
 */
export const adaptRoute = <T>(
  controller: (modelProvider: ModelProvider) => Controller,
  handler: T,
  validation: CompositeValidator
) => {
  return async (req: Request, res: Response) => {
    const request: HttpRequest = {
      ...(req.body ?? {}),
      ...(req.query ?? {}),
      ...(req.params ?? {})
    }

    const modelProvider = ModelFactory.create(req.body.company)

    const httpResponse = await controller(modelProvider).handle(request, handler, validation)
    if (httpResponse.statusCode() >= 200 && httpResponse.statusCode() <= 299) {
      res.status(httpResponse.statusCode()).json(httpResponse.getHttpResponseBody())
    } else {
      res.status(httpResponse.statusCode()).json({
        error: httpResponse.getHttpResponseBody()
      })
    }
  }
}
