import prisma from '@/lib/prisma';
import { generateAutonomousPost } from '../ai/autonomous';
import { publishToThreads } from '../social/threads';

export async function runExecutionTick() {
  const results: any[] = [];
  
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona?.isAutopilotEnabled) return { message: "Autopilot is disabled", results: [] };

    // 1. Process Scheduled Posts (Transition from Queued to Published)
    const now = new Date();
    const readyToPublish = await prisma.contentNode.findMany({
      where: {
        status: 'Queued',
        scheduledFor: { lte: now }
      }
    });

    for (const node of readyToPublish) {
      // 1.1 Check if an active account exists in DB for this platform
      const activeAccount = await prisma.socialAccount.findFirst({
        where: { personaId: persona.id, platform: node.platform, isActive: true }
      });

      // Real API check for Threads
      if (node.platform === 'Threads' && (activeAccount?.accessToken || process.env.THREADS_ACCESS_TOKEN)) {
        const token = activeAccount?.accessToken || process.env.THREADS_ACCESS_TOKEN;
        const userId = activeAccount?.externalId || process.env.THREADS_USER_ID; 
        
        const publishRes = await publishToThreads(node.body, token as string, userId as string);
        if (publishRes.success) {
          await prisma.contentNode.update({
            where: { id: node.id },
            data: { 
              status: 'Published', 
              publishedAt: now,
              externalId: publishRes.ids?.[0]
            }
          });
          results.push({ type: 'publish', nodeId: node.id, platform: node.platform, success: true });
        } else {
          results.push({ type: 'error', nodeId: node.id, error: publishRes.error });
        }
      } else {
        // Simulation for others or missing credentials
        await prisma.contentNode.update({
          where: { id: node.id },
          data: { status: 'Published', publishedAt: now }
        });
        results.push({ type: 'publish', nodeId: node.id, platform: node.platform, simulated: true });
      }
    }

    // 1.5. Simulate Interactions for Existing Published Posts
    const publishedRows = await prisma.contentNode.findMany({
      where: { status: 'Published' },
      take: 10,
      orderBy: { publishedAt: 'desc' }
    });

    if (publishedRows.length > 0) {
      const randomNode = publishedRows[Math.floor(Math.random() * publishedRows.length)];
      const randomAudience = await prisma.audienceIntel.findFirst({
        skip: Math.floor(Math.random() * (await prisma.audienceIntel.count() || 1))
      });

      if (randomAudience) {
        const actions = ["Liked", "Replied", "Shared", "Insightful"];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        await prisma.audienceIntel.update({
          where: { id: randomAudience.id },
          data: {
            lastAction: `${action} your post on ${randomNode.platform}`,
            lastActionAt: now,
            relationshipScore: { increment: 5 }
          }
        });
        results.push({ type: 'interaction', audience: randomAudience.name, action });
      }
    }

    // 2. Check Daily Quota and Generate New Content if needed
    // Simple logic: if today we haven't generated anything, generate one.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const countToday = await prisma.contentNode.count({
      where: {
        createdAt: { gte: startOfDay },
        isAutopilotGenerated: true
      }
    });

    // Get velocity from postsPerDay
    const limit = persona.postsPerDay || 1;

    console.log(`[Engine Tick] Persona: ${persona.id}, Enabled: ${persona.isAutopilotEnabled}, Count: ${countToday}, Limit: ${limit}`);

    if (countToday < limit) {
      const genResult = await generateAutonomousPost();
      if (genResult.success) {
        results.push({ type: 'generate', nodeId: (genResult as any).node?.id, topic: (genResult as any).topic });
      } else {
        results.push({ type: 'error', error: genResult.error });
      }
    }

    const message = results.length > 0 ? "Tick processed successfully" : `No items processed (Enabled: ${persona.isAutopilotEnabled}, Count: ${countToday}/${limit})`;
    return { message, results };
  } catch (error: any) {
    console.error("Execution Engine Tick failed:", error);
    return { message: "Tick failed", error: error.message, results: [] };
  }
}
