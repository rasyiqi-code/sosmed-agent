import { AIResponse, AIRegistration } from '../orchestrator';

export class GeminiProvider implements AIRegistration {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    const modelName = options?.model || this.model;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: options?.generationConfig
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      // Gemini usage is in data.usageMetadata
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount
      } : undefined
    };
  }
}
