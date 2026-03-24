'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function seedDatabase() {
  try {
    // 1. Clear existing data to prevent duplicates
    await prisma.audienceIntel.deleteMany();
    await prisma.knowledgeAsset.deleteMany();
    await prisma.contentNode.deleteMany();
    await prisma.campaign.deleteMany();
    
    let persona;
    const existingPersona = await prisma.persona.findFirst();
    
    const personaData = {
      whoAmI: "Digital Architect & Minimalist Design Consultant based in Jakarta. Specializing in high-end UI/UX and automation systems.",
      businessProject: "Antigravity Studio",
      socialMediaGoal: "Authority Building & Leads",
      coreValues: "Passion for extreme minimalism, mechanical watches, and the intersection of AI and human creativity.",
      professionalism: 85,
      creativity: 70,
      enthusiasm: 45,
      isAutopilotEnabled: true,
      postsPerDay: 4,
      narrativeFocus: "Exploring the intersection of Architectural Minimalism and Agentic AI."
    };

    if (existingPersona) {
      persona = await prisma.persona.update({
        where: { id: existingPersona.id },
        data: personaData
      });
    } else {
      persona = await prisma.persona.create({
        data: personaData
      });
    }

    // 2. Campaigns
    await prisma.campaign.createMany({
      data: [
        { personaId: persona.id, name: 'Q3 Product Launch: Minimalism', objective: 'Conversion', status: 'Running', frequency: '2/day', progress: 45, reach: 12400 },
        { personaId: persona.id, name: 'AI & Future of Work Series', objective: 'Brand Awareness', status: 'Paused', frequency: '3/week', progress: 12, reach: 4100 },
        { personaId: persona.id, name: 'Agency Outbound Leads', objective: 'Lead Gen', status: 'Running', frequency: '3/day', progress: 80, reach: 42000 },
        { personaId: persona.id, name: 'Sustainable Design Weekly', objective: 'Engagement', status: 'Running', frequency: '1/day', progress: 65, reach: 18500 },
        { personaId: persona.id, name: 'Jakarta Tech Scene Insights', objective: 'Networking', status: 'Paused', frequency: '2/week', progress: 30, reach: 8900 },
        { personaId: persona.id, name: 'The Art of Slow Growth', objective: 'Brand Authority', status: 'Running', frequency: '4/week', progress: 50, reach: 25000 }
      ]
    });

    // 3. ContentNodes
    await prisma.contentNode.createMany({
      data: [
        { personaId: persona.id, platform: 'Twitter', body: 'Morning Coffee Rituals: Why friction is the enemy of creativity.', status: 'Published', scheduledFor: new Date() },
        { personaId: persona.id, platform: 'LinkedIn', body: 'The Architecture of Minimalism in B2B SaaS: A Thread.', status: 'Queued', scheduledFor: new Date(Date.now() + 3600), publishedAt: null },
        { personaId: persona.id, platform: 'Twitter', body: 'The Velocity of Growth is proportional to the simplicity of the system.', status: 'Draft', scheduledFor: new Date(Date.now() + 86400) }
      ]
    });

    // 4. KnowledgeAssets
    await prisma.knowledgeAsset.createMany({
      data: [
        { personaId: persona.id, type: 'link', title: 'The Architecture of Minimalism', url: 'https://medium.com/minimalism', status: 'Vectorized' },
        { personaId: persona.id, type: 'note', title: 'Friction is the enemy', content: 'The goal is zero-click publishing based on absolute trust.', status: 'Vectorized' },
        { personaId: persona.id, type: 'doc', title: 'Agency Growth Strategies.pdf', status: 'Vectorized' }
      ]
    });

    // 5. NetworkIntel
    await prisma.audienceIntel.createMany({
      data: [
        { personaId: persona.id, name: 'David Schmidt', title: 'Founder @ NeoFin', status: 'Nurturing', relationshipScore: 94, lastAction: 'AI engaged with thread' },
        { personaId: persona.id, name: 'Elena Rostkova', title: 'UX Lead @ Scale', status: 'High Value', relationshipScore: 88, lastAction: 'AI liked case study' },
        { personaId: persona.id, name: 'Marcus Chen', title: 'VC @ SeriesA', status: 'Watching', relationshipScore: 76, lastAction: 'Requested connection' }
      ]
    });

    revalidatePath('/');
    return { success: true, message: "Seeded successfully" };
  } catch (error) {
    console.error("Failed to seed database:", error);
    return { success: false, message: "Seed failed" };
  }
}
