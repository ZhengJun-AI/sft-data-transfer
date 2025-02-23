interface LLMConfig {
  apiEndpoint: string
  apiKey: string
  model: string
}

interface Config {
  llm: {
    defaultEndpoint: string
    defaultModel: string
    availableModels: string[]
  }
}

const config: Config = {
  llm: {
    defaultEndpoint: process.env.NEXT_PUBLIC_LLM_API_ENDPOINT || 'https://api.example.com/v1/chat/completions',
    defaultModel: process.env.NEXT_PUBLIC_LLM_MODEL || 'gpt-3.5-turbo',
    availableModels: [
      'gpt-3.5-turbo',
      'gpt-4',
    ]
  }
}

export type { LLMConfig }
export default config