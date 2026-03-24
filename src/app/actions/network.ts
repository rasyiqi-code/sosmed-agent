'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAudienceIntel() {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) return [];

    return await prisma.audienceIntel.findMany({
      where: { personaId: persona.id },
      orderBy: [
        { relationshipScore: 'desc' },
        { lastActionAt: 'desc' }
      ]
    });
  } catch (error) {
    console.error("Failed to fetch audience intel:", error);
    return [];
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    await prisma.audienceIntel.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/network');
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false };
  }
}

export async function nukeNetwork() {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) return { success: false };
    
    await prisma.audienceIntel.deleteMany({
      where: { personaId: persona.id }
    });
    revalidatePath('/network');
    return { success: true };
  } catch (error) {
    console.error("Failed to nuke network:", error);
    return { success: false };
  }
}
