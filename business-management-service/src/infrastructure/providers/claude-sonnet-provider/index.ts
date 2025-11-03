import Anthropic from '@anthropic-ai/sdk'

import { ModelProvider } from '@service/contracts/model-provider'
import { Model } from '@ts/enums'

export class ClaudeSonnetProvider implements ModelProvider {
  private readonly client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async listModels(): Promise<void> {
    const response = await this.client.models.list()
    console.log('[ClaudeSonnetProvider] available models: ', response.data)
  }

  async ping(model: Model): Promise<void> {
    const response = await this.client.messages.create({
      model,
      messages: [{ role: 'user', content: 'ping ' }],
      max_tokens: 1
    })
    console.log('[ClaudeSonnetProvider] ping response: ', response)
  }
}
