'use server';

import prisma from '@/lib/prisma';
import { orchestrator, getAIProvider } from '@/lib/ai';
import { buildSystemPrompt } from '@/lib/ai/prompts';
import { getRelevantContext, formatContext } from '@/lib/ai/rag';

export async function generateDraft(message: string, steering?: string) {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    // 1. Retrieve RAG context
    const assets = await getRelevantContext(message + (steering || ''));
    const context = formatContext(assets);

    // 2. Build Prompt
    const systemPrompt = buildSystemPrompt(persona, context);
    const fullPrompt = `${systemPrompt}\n${steering ? `GLOBAL STEERING: ${steering}\n` : ''}REQUEST: ${message}`;

    // 3. Generate via Orchestrator
    const provider = getAIProvider();
    const response = await orchestrator.generate(provider, fullPrompt);

    return { 
      success: true, 
      text: response.text,
      contextUsed: assets.map(a => a.title)
    };
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return { success: false, error: error.message };
  }
}
