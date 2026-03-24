import prisma from '@/lib/prisma';

export async function getRelevantContext(query: string, limit = 3) {
  try {
    const assets = await prisma.knowledgeAsset.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: limit
    });

    if (assets.length === 0) {
      // Fallback: search for each word if exact phrase match fails
      const words = query.split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0) {
        return await prisma.knowledgeAsset.findMany({
          where: {
            OR: words.map(word => ({
              OR: [
                { title: { contains: word, mode: 'insensitive' } },
                { content: { contains: word, mode: 'insensitive' } },
              ]
            }))
          },
          take: limit
        });
      }
    }

    return assets;
  } catch (error) {
    console.error("RAG Retrieval error:", error);
    return [];
  }
}

export function formatContext(assets: any[]) {
  return assets.map(a => `[Source: ${a.title}]\n${a.content || a.url}`).join('\n\n');
}
