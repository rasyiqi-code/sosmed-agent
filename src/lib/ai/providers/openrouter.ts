import { AIResponse, AIRegistration } from '../orchestrator';

export class OpenRouterProvider implements AIRegistration {
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel = 'openrouter/free') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    const model = options?.model || this.defaultModel;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens
      }
    };
  }
}
