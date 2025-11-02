import { type Model } from 'ts/enums'

export class FallBackEvent {
  private readonly id: string

  constructor(
    private readonly create_date: string,
    private readonly modelName: Model,
    private readonly rootCause: string
  ) {}
}
