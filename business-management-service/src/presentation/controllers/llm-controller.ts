import { LLMService } from '@domain/contracts/llm-service'
import { LLM } from '@domain/entities/llm'
import { BaseController } from '@presentation/contracts'
import { CheckHealthDto } from '@presentation/dtos'
import { HttpResponse, ResponseEntity } from '@presentation/helpers'
import { CompositeValidator } from 'coffeeless-schema-validators'

export class LLMController extends BaseController {
  constructor(private readonly llmService: LLMService) {
    super()
  }

  private async checkHealth(
    request: CheckHealthDto,
    validation: CompositeValidator
  ): Promise<ResponseEntity> {
    const responseTime = new Date().toISOString()
    validation.failFast().validate(request)
    const { company, model } = request
    const llm = new LLM(company, model)
    await this.llmService.checkHealth(llm)
    const httpResponse = HttpResponse.build(
      responseTime,
      null,
      'Health check operation successfully completed.'
    )
    return ResponseEntity.ok().body(httpResponse)
  }
}

export namespace LLMController {
  /**
   * Lists the handler methods available in {@link LLMController}
   */
  export type Handler = 'checkHealth'
}
