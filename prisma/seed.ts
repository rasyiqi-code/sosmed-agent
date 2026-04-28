import prisma from '../src/lib/prisma'


async function main() {
  // 1. Persona
  const persona = await prisma.persona.upsert({
    where: { id: 'default-persona' },
    update: {},
    create: {
      id: 'default-persona',
      whoAmI: "Digital Architect & Minimalist Design Consultant based in Jakarta. Specializing in high-end UI/UX and automation systems.",
      businessProject: "Antigravity Studio",
      socialMediaGoal: "Authority Building & Leads",
      coreValues: "Passion for extreme minimalism, mechanical watches, and the intersection of AI and human creativity. Believes in 'relentless presence' with zero friction.",
      professionalism: 85,
      creativity: 70,
      enthusiasm: 45
    }
  })

  // 2. Campaigns
  await prisma.campaign.createMany({
    data: [
      { personaId: persona.id, name: 'Q3 Product Launch: Minimalism', objective: 'Conversion', status: 'Running', frequency: '2/day', progress: 45, reach: 12400 },
      { personaId: persona.id, name: 'AI & Future of Work Series', objective: 'Brand Awareness', status: 'Paused', frequency: '3/week', progress: 12, reach: 4100 },
      { personaId: persona.id, name: 'Agency Outbound Leads', objective: 'Lead Gen', status: 'Running', frequency: '3/day', progress: 80, reach: 42000 }
    ]
  })

  // 3. ContentNodes
  await prisma.contentNode.createMany({
    data: [
      { personaId: persona.id, platform: 'Twitter', body: 'Morning Coffee Rituals: Why friction is the enemy of creativity.', status: 'Published', scheduledFor: new Date() },
      { personaId: persona.id, platform: 'LinkedIn', body: 'The Architecture of Minimalism in B2B SaaS: A Thread.', status: 'Queued', scheduledFor: new Date(Date.now() + 3600000) },
      { personaId: persona.id, platform: 'Twitter', body: 'The Velocity of Growth is proportional to the simplicity of the system.', status: 'Draft', scheduledFor: new Date(Date.now() + 86400000) }
    ]
  })

  // 4. KnowledgeAssets
  await prisma.knowledgeAsset.createMany({
    data: [
      { personaId: persona.id, type: 'link', title: 'The Architecture of Minimalism', url: 'https://medium.com/minimalism', status: 'Vectorized' },
      { personaId: persona.id, type: 'note', title: 'Friction is the enemy', content: 'The goal is zero-click publishing based on absolute trust.', status: 'Vectorized' },
      { personaId: persona.id, type: 'doc', title: 'Agency Growth Strategies.pdf', status: 'Vectorized' }
    ]
  })

  // 5. NetworkIntel
  await prisma.audienceIntel.createMany({
    data: [
      { personaId: persona.id, name: 'David Schmidt', title: 'Founder @ NeoFin', status: 'Nurturing', relationshipScore: 94, lastAction: 'AI engaged with thread' },
      { personaId: persona.id, name: 'Elena Rostkova', title: 'UX Lead @ Scale', status: 'High Value', relationshipScore: 88, lastAction: 'AI liked case study' },
      { personaId: persona.id, name: 'Marcus Chen', title: 'VC @ SeriesA', status: 'Watching', relationshipScore: 76, lastAction: 'Requested connection' }
    ]
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
