export class FallBackEvent {
  private readonly id: string

  constructor(
    private readonly create_date: string,
    private readonly llm: number, // fk
    private readonly rootCause: string
  ) {}
}
