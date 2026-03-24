'use server';

import prisma from '@/lib/prisma';
import { getThreadsMetrics } from '@/lib/social/threads';

export async function getRealTimeMetrics() {
  try {
    const publishedPosts = await prisma.contentNode.findMany({
      where: { 
        status: 'Published',
        platform: 'Threads',
        externalId: { not: null }
      }
    });

    let totalLikes = 0;
    let totalReplies = 0;
    let totalReposts = 0;

    for (const post of publishedPosts) {
      if (post.externalId) {
        const res = await getThreadsMetrics(post.externalId);
        if (res.success && res.metrics) {
          totalLikes += res.metrics.likes;
          totalReplies += res.metrics.replies;
          totalReposts += res.metrics.reposts;
        }
      }
    }

    return {
      success: true,
      engagement: totalLikes + totalReplies + totalReposts,
      breakdown: {
        likes: totalLikes,
        replies: totalReplies,
        reposts: totalReposts
      },
      count: publishedPosts.length
    };
  } catch (error) {
    console.error("Failed to fetch real-time metrics:", error);
    return { success: false, engagement: 0 };
  }
}
