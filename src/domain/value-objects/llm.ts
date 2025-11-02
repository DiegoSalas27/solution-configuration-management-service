import { type Company } from 'ts/enums'

export class LLM {
  private readonly id: string

  constructor(
    private readonly name: Company,
    private readonly version: string
  ) {}
}
