import { Model, type Company } from 'ts/enums'

export class LLM {
  private readonly id: string

  constructor(
    private readonly company: Company,
    private readonly model: Model
  ) {}

  getCompany() {
    return this.company
  }

  getModel() {
    return this.model
  }
}
