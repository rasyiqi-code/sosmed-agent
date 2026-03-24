import { AIResponse, AIRegistration } from '../orchestrator';

export class OpenAIProvider implements AIRegistration {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    const modelName = options?.model || this.model;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
      throw new Error(`OpenAI error: ${JSON.stringify(error)}`);
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
