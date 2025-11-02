import { type Model } from 'ts/enums'

export class LLM {
  private readonly id: string

  constructor(
    private readonly name: Model,
    private readonly version: string
  ) {}
}
