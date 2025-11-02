import { type Company } from 'ts/enums'

export class SimulationConfiguration {
  private readonly id: string

  constructor(
    private readonly primaryModel: Company,
    private readonly secondaryModel: Company,
    private readonly expectedMaxLatency: number
  ) {}
}
