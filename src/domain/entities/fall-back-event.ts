import { Entity } from './entity-model'

export class FallBackEvent extends Entity {
  private id: string

  constructor(
    private readonly create_date: string,
    private readonly llm: string, // fk
    private readonly rootCause: string
  ) {
    super()
  }

  static fromDbRow(row: Record<string, any>): FallBackEvent {
    const mappedFallBackEvent = this.toCamelCaseKeys<FallBackEvent>(row)
    const fallBackEvent = new FallBackEvent(
      mappedFallBackEvent.create_date,
      mappedFallBackEvent.llm,
      mappedFallBackEvent.rootCause
    )
    fallBackEvent.setId(mappedFallBackEvent.id)
    return fallBackEvent
  }

  setId(id: string) {
    this.id = id
  }

  getId() {
    return this.id
  }

  getCreateDate() {
    return this.create_date
  }

  getLLM() {
    return this.llm
  }

  getRootCause() {
    return this.rootCause
  }
}
