'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCampaigns() {
  try {
    return await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

export async function createCampaign(data: { name: string, objective: string, frequency: string }) {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const campaign = await prisma.campaign.create({
      data: {
        personaId: persona.id,
        name: data.name,
        objective: data.objective,
        frequency: data.frequency,
        status: 'Running',
        progress: 0,
        reach: 0
      }
    });

    revalidatePath('/campaigns');
    return { success: true, campaign };
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return { success: false, error: 'Failed to create campaign' };
  }
}

export async function toggleCampaignStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'Running' ? 'Paused' : 'Running';
    await prisma.campaign.update({
      where: { id },
      data: { status: newStatus }
    });
    revalidatePath('/campaigns');
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle campaign status:", error);
    return { success: false };
  }
}
