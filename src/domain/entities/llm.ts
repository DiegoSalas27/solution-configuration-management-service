import { Model, type Company } from 'ts/enums'
import { Entity } from './entity-model'

export class LLM extends Entity {
  private id: string

  constructor(
    private readonly company: Company,
    private readonly model: Model
  ) {
    super()
  }

  static fromDbRow(row: Record<string, any>): LLM {
    const mappedLLM = this.toCamelCaseKeys<LLM>(row)
    const llm = new LLM(mappedLLM.company, mappedLLM.model)
    llm.setId(mappedLLM.id)
    return llm
  }

  setId(id: string) {
    this.id = id
  }

  getId() {
    return this.id
  }

  getCompany() {
    return this.company
  }

  getModel() {
    return this.model
  }
}
