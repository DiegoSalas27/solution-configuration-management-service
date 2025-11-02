import { type Model } from 'ts/enums'

export class SimulationConfiguration {
  private readonly id: string

  constructor(
    private readonly primaryModel: Model,
    private readonly secondaryModel: Model,
    private readonly expectedMaxLatency: number
  ) {}
}
