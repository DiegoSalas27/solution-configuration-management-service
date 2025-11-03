import OpenAI from 'openai'

import { ModelProvider } from '@service/contracts/model-provider'
import { Model } from '@ts/enums'

export class GPT4oProvider implements ModelProvider {
  private readonly client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async listModels(): Promise<void> {
    const response = await this.client.models.list()
    console.log('[GPT4oProvider] available models: ', response.data)
  }

  async ping(model: Model): Promise<void> {
    const response = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1
    })
    console.log('[GPT4oProvider] ping response: ', response)
  }
}
