import prisma from '../lib/prisma';
import DashboardClient from './DashboardClient';
import { seedDatabase } from './actions/seed';

import { getRealTimeMetrics } from './actions/analytics';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const personaCount = await prisma.persona.count();
  if (personaCount === 0) {
    await seedDatabase();
  }

  const campaigns = await prisma.campaign.findMany();
  const contentNodes = await prisma.contentNode.findMany({
    orderBy: { scheduledFor: 'asc' },
    take: 3
  });
  const persona = await prisma.persona.findFirst();
  
  const realMetrics = await getRealTimeMetrics();
  
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const runningCampaigns = campaigns.filter(c => c.status === 'Running').length;

  const dashboardData = {
    totalReach,
    runningCampaigns,
    engagement: realMetrics.success ? realMetrics.engagement : 42500, // Fallback to mock if API fails
    autopilotSettings: {
      isEnabled: (persona as any)?.isAutopilotEnabled ?? false,
      postsPerDay: (persona as any)?.postsPerDay ?? 0,
    },
    nextMoves: contentNodes.map(node => ({
      time: node.scheduledFor ? new Date(node.scheduledFor).toLocaleString('en-US', { weekday: 'short', hour: 'numeric' }) : 'TBD',
      text: node.body,
      platform: node.platform
    }))
  };

  return (
    <DashboardClient data={dashboardData} />
  );
}
