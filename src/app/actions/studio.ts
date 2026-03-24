'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createContentNode(data: {
  personaId: string;
  platform: string;
  body: string;
  scheduledFor?: Date;
}) {
  const content = await prisma.contentNode.create({
    data: {
      ...data,
      status: 'Queued',
    }
  });
  revalidatePath('/chronology');
  revalidatePath('/');
  return content;
}
