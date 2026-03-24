'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getKnowledgeAssets() {
  try {
    return await prisma.knowledgeAsset.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch knowledge assets:", error);
    return [];
  }
}

export async function addKnowledgeAsset(data: { title: string, type: string, source: string }) {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const asset = await prisma.knowledgeAsset.create({
      data: {
        personaId: persona.id,
        title: data.title,
        type: data.type,
        content: data.type === 'note' ? data.source : null,
        url: data.type === 'link' ? data.source : null,
        status: 'Vectorized'
      }
    });

    revalidatePath('/cortex');
    return { success: true, asset };
  } catch (error) {
    console.error("Failed to add knowledge asset:", error);
    return { success: false };
  }
}

export async function deleteKnowledgeAsset(id: string) {
  try {
    await prisma.knowledgeAsset.delete({
      where: { id }
    });
    revalidatePath('/cortex');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete knowledge asset:", error);
    return { success: false };
  }
}
