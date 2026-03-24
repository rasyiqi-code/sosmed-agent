import { orchestrator, AIProvider } from './orchestrator';
import { OpenRouterProvider } from './providers/openrouter';
import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { GenericOpenAIProvider } from './providers/generic-openai';

// Initialize providers based on available API keys
if (process.env.OPENROUTER_API_KEY) {
  orchestrator.register('openrouter', new OpenRouterProvider(process.env.OPENROUTER_API_KEY));
}

if (process.env.GEMINI_API_KEY) {
  orchestrator.register('gemini', new GeminiProvider(process.env.GEMINI_API_KEY));
}

if (process.env.OPENAI_API_KEY) {
  orchestrator.register('openai', new OpenAIProvider(process.env.OPENAI_API_KEY));
}

if (process.env.ANTHROPIC_API_KEY) {
  orchestrator.register('anthropic', new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
}

if (process.env.DEEPSEEK_API_KEY) {
  orchestrator.register('deepseek', new GenericOpenAIProvider(
    process.env.DEEPSEEK_API_KEY, 
    'https://api.deepseek.com', 
    'DeepSeek', 
    'deepseek-chat'
  ));
}

if (process.env.KIMI_API_KEY) {
  orchestrator.register('kimi', new GenericOpenAIProvider(
    process.env.KIMI_API_KEY, 
    'https://api.moonshot.cn/v1', 
    'Kimi', 
    'moonshot-v1-8k'
  ));
}

if (process.env.QWEN_API_KEY) {
  orchestrator.register('qwen', new GenericOpenAIProvider(
    process.env.QWEN_API_KEY, 
    'https://dashscope.aliyuncs.com/compatible-mode/v1', 
    'Qwen', 
    'qwen-plus'
  ));
}

if (process.env.ZHIPU_API_KEY) {
  orchestrator.register('zhipu', new GenericOpenAIProvider(
    process.env.ZHIPU_API_KEY, 
    'https://open.bigmodel.cn/api/paas/v4', 
    'Zhipu', 
    'glm-4'
  ));
}

if (process.env.MINIMAX_API_KEY) {
  orchestrator.register('minimax', new GenericOpenAIProvider(
    process.env.MINIMAX_API_KEY, 
    'https://api.minimax.chat/v1', 
    'Minimax', 
    'abab6.5-chat'
  ));
}

// Default provider selection logic
export function getAIProvider(): AIProvider {
  const providers: AIProvider[] = [
    'openrouter', 'gemini', 'openai', 'anthropic', 
    'deepseek', 'kimi', 'qwen', 'zhipu', 'minimax'
  ];
  
  for (const p of providers) {
    if (process.env[`${p.toUpperCase()}_API_KEY` as any]) return p;
  }
  
  throw new Error("No AI providers configured. Please check your .env file.");
}

export { orchestrator };
