import { ClaudeSonnetProvider, GPT4oProvider } from '@infrastructure/providers'
import { ModelProvider } from '@service/contracts/model-provider'
import { Company } from '@ts/enums'

export class ModelFactory {
  static create(companyName: Company): ModelProvider {
    if (companyName === Company.OPENAI) {
      const apiKey = this.getEnvVar('OPEN_API_KEY')
      return new GPT4oProvider(apiKey)
    }

    if (companyName === Company.ANTHROPIC) {
      const apiKey = this.getEnvVar('ANTHROPIC_API_KEY')
      return new ClaudeSonnetProvider(apiKey)
    }

    throw new Error(`Unknown company name: ${companyName}`)
  }

  private static getEnvVar(name: string) {
    const value = process.env[name]
    if (value === undefined || value.trim() === '') {
      throw new Error('Something went wrong')
    }
    return value
  }
}
