'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAutopilotSettings() {
  const persona = await prisma.persona.findFirst({
    orderBy: { updatedAt: 'desc' }
  });
  return persona;
}

export async function updateAutopilotSettings(id: string, data: {
  isAutopilotEnabled?: boolean;
  postsPerDay?: number;
  narrativeFocus?: string;
}) {
  const updated = await prisma.persona.update({
    where: { id },
    data
  });
  revalidatePath('/autopilot');
  revalidatePath('/');
  return updated;
}
