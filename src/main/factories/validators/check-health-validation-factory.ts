import { CheckHealthDto } from '@presentation/dtos'
import { CompositeValidator, schemaValidator, string } from 'coffeeless-schema-validators'

export const makeCheckHealthValidation = (): CompositeValidator => {
  return schemaValidator<CheckHealthDto>({
    company: string()
      .required()
      .valid(/openai|anthropic/)
      .build(),
    model: string()
      .required()
      .valid(/gpt-4o|claude-sonnet-4-5/)
      .build()
  })
}
