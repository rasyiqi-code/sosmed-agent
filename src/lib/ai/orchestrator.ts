export type AIProvider = 'openrouter' | 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'zhipu' | 'minimax' | 'kimi' | 'qwen';

export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AIRegistration {
  generate(prompt: string, options?: any): Promise<AIResponse>;
}

class AIOrchestrator {
  private providers: Map<AIProvider, AIRegistration> = new Map();

  register(name: AIProvider, provider: AIRegistration) {
    this.providers.set(name, provider);
  }

  async generate(provider: AIProvider, prompt: string, options?: any): Promise<AIResponse> {
    const p = this.providers.get(provider);
    if (!p) {
      throw new Error(`Provider ${provider} not registered`);
    }
    return p.generate(prompt, options);
  }
}

export const orchestrator = new AIOrchestrator();
