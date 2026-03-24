import prisma from '@/lib/prisma';
import { orchestrator, getAIProvider } from './index';
import { buildSystemPrompt } from './prompts';
import { getRelevantContext, formatContext } from './rag';

export async function generateAutonomousPost(campaignId?: string) {
  try {
    const persona = await prisma.persona.findFirst() as any;
    if (!persona) throw new Error("No active persona found");

    if (!persona.isAutopilotEnabled) return { success: false, error: "Autopilot is disabled" };

    // 1. Determine Topic
    let topicHint = persona.narrativeFocus || persona.socialMediaGoal;
    let campaignName = "";

    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
      if (campaign) {
        topicHint = `${campaign.name} - Objective: ${campaign.objective}`;
        campaignName = campaign.name;
      }
    } else {
      // Pick a random running campaign occasionally
      const runningCount = await prisma.campaign.count({ where: { status: 'Running' } });
      if (runningCount > 0) {
        const randomCampaign = await prisma.campaign.findFirst({
          where: { status: 'Running' },
          skip: Math.floor(Math.random() * runningCount)
        });
        if (randomCampaign) {
          topicHint = `${randomCampaign.name} - Objective: ${randomCampaign.objective}`;
          campaignName = randomCampaign.name;
        }
      }
    }

    // 2. RAG Context
    const assets = await getRelevantContext(topicHint, 2);
    const context = formatContext(assets);

    // 3. Build Prompt
    const systemPrompt = buildSystemPrompt(persona, context);
    const fullPrompt = `${systemPrompt}
TASK: Generate a high-impact, premium Threads post (conversational yet professional) that aligns with your persona and the current focus: "${topicHint}".
The tone should be "Architectural Minimalism": precise, thoughtful, and high-value.
DO NOT use hashtags unless absolutely necessary for the brand.
NEVER use more than 2000 characters (the system will automatically split it into a thread if it exceeds 500 chars).
`;

    // 4. Generate
    const provider = getAIProvider();
    const response = await orchestrator.generate(provider, fullPrompt, {
      max_tokens: 1000
    });

    if (!response || !response.text) {
      throw new Error("AI provider returned an empty or invalid response");
    }

    // 5. Create Content Node
    const newNode = await prisma.contentNode.create({
      data: {
        personaId: persona.id,
        campaignId: campaignId || null,
        platform: 'Threads',
        body: response.text,
        status: 'Queued',
        isAutopilotGenerated: true,
        scheduledFor: new Date(Date.now() + 3600000) // Schedule for 1 hour from now
      }
    });

    return { 
      success: true, 
      node: newNode,
      topic: topicHint,
      contextUsed: assets.map(a => a.title)
    };
  } catch (error: any) {
    console.error("Autonomous generation failed:", error);
    return { success: false, error: error.message };
  }
}
