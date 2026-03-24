import { AIResponse, AIRegistration } from '../orchestrator';

export class GenericOpenAIProvider implements AIRegistration {
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private providerName: string;

  constructor(apiKey: string, baseUrl: string, providerName: string, model: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.providerName = providerName;
    this.model = model;
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    const modelName = options?.model || this.model;
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${this.providerName} error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens
      } : undefined
    };
  }
}
