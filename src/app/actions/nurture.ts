'use server';

import prisma from '@/lib/prisma';
import { orchestrator, getAIProvider } from '@/lib/ai';
import { buildSystemPrompt } from '@/lib/ai/prompts';
import { getRelevantContext, formatContext } from '@/lib/ai/rag';

export async function generateNurtureReply(audienceId: string) {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const audience = await prisma.audienceIntel.findUnique({
      where: { id: audienceId }
    });
    if (!audience || !audience.lastAction) throw new Error("Audience member or last action not found");

    // 1. RAG Context for the person's interests/title
    const assets = await getRelevantContext(`${audience.name} ${audience.title}`, 1);
    const context = formatContext(assets);

    // 2. Build Prompt
    const systemPrompt = buildSystemPrompt(persona, context);
    const fullPrompt = `${systemPrompt}
TASK: Generate a personalized, minimalist, and high-value reply to this person's latest interaction: "${audience.lastAction}".
The person is: ${audience.name} (${audience.title}).
Your goal is to nurture the relationship and build authority.
Keep it short, professional, and consistent with your "Architectural Minimalism" persona.
DO NOT use hashtags or generic AI enthusiastic language.
`;

    // 3. Generate
    const provider = getAIProvider();
    const response = await orchestrator.generate(provider, fullPrompt, {
      max_tokens: 100
    });

    return { success: true, reply: response.text };
  } catch (error: any) {
    console.error("Failed to generate nurture reply:", error);
    return { success: false, error: error.message };
  }
}
