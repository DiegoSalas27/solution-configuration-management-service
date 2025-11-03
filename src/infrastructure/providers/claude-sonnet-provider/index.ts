import Anthropic from '@anthropic-ai/sdk'

import { ModelProvider } from '@service/contracts/model-provider'

export class ClaudeSonnetProvider implements ModelProvider {
  private readonly client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async listModels(): Promise<void> {
    const response = await this.client.models.list()
    console.log('[ClaudeSonnetProvider] available models: ', response.data)
  }

  async ping(): Promise<void> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5',
      messages: [{ role: 'user', content: 'ping ' }],
      max_tokens: 1
    })
    console.log('[ClaudeSonnetProvider] ping response: ', response)
  }
}
