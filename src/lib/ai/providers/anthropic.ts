import { AIResponse, AIRegistration } from '../orchestrator';

export class AnthropicProvider implements AIRegistration {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'claude-3-5-sonnet-20240620') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    const modelName = options?.model || this.model;
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: options?.max_tokens || 1024,
        messages: [{ role: "user", content: prompt }],
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      text: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens
      }
    };
  }
}
