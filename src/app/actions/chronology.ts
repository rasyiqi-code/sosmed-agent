'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getContentNodes() {
  try {
    return await prisma.contentNode.findMany({
      orderBy: { scheduledFor: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch content nodes:", error);
    return [];
  }
}

export async function createContentNode(data: { platform: string, body: string, scheduledFor?: Date }) {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const node = await prisma.contentNode.create({
      data: {
        personaId: persona.id,
        platform: data.platform,
        body: data.body,
        status: 'Queued',
        scheduledFor: data.scheduledFor || new Date(Date.now() + 3600000), // Default to 1 hour later
      }
    });

    revalidatePath('/chronology');
    return { success: true, node };
  } catch (error) {
    console.error("Failed to create content node:", error);
    return { success: false };
  }
}

export async function deleteContentNode(id: string) {
  try {
    await prisma.contentNode.delete({
      where: { id }
    });
    revalidatePath('/chronology');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete content node:", error);
    return { success: false };
  }
}

export async function updateContentNodeStatus(id: string, status: string) {
  try {
    await prisma.contentNode.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/chronology');
    return { success: true };
  } catch (error) {
    console.error("Failed to update content node status:", error);
    return { success: false };
  }
}
