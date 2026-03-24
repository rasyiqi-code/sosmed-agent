'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getThreadsProfile, getThreadsAuthUrl } from '@/lib/social/threads';

export async function getThreadsAuthUrlAction() {
  try {
    return await getThreadsAuthUrl();
  } catch (error: any) {
    console.error("Failed to get auth URL:", error);
    throw new Error(error.message);
  }
}

export async function getSocialAccounts() {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) return [];
    
    return await prisma.socialAccount.findMany({
      where: { personaId: persona.id },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch social accounts:", error);
    return [];
  }
}

export async function connectMockAccount(platform: string, handle: string, avatarUrl?: string) {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const account = await prisma.socialAccount.create({
      data: {
        personaId: persona.id,
        platform,
        handle,
        avatarUrl: avatarUrl || `https://i.pravatar.cc/150?u=${handle}`,
        isActive: true,
      }
    });

    revalidatePath('/connections');
    revalidatePath('/');
    return { success: true, account };
  } catch (error: any) {
    console.error("Failed to connect account:", error);
    return { success: false, error: error.message };
  }
}

export async function connectThreadsAccount() {
  try {
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const profileRes = await getThreadsProfile();
    if (!profileRes.success) throw new Error(profileRes.error);

    // Update existing or create new
    const existing = await prisma.socialAccount.findFirst({
      where: { personaId: persona.id, platform: 'Threads' }
    });

    let account;
    if (existing) {
      account = await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          handle: profileRes.username,
          avatarUrl: profileRes.avatarUrl,
          isActive: true
        }
      });
    } else {
      account = await prisma.socialAccount.create({
        data: {
          personaId: persona.id,
          platform: 'Threads',
          handle: profileRes.username,
          avatarUrl: profileRes.avatarUrl,
          isActive: true
        }
      });
    }

    revalidatePath('/connections');
    revalidatePath('/studio');
    revalidatePath('/');
    return { success: true, account };
  } catch (error: any) {
    console.error("Failed to connect Threads account:", error);
    return { success: false, error: error.message };
  }
}

export async function disconnectAccount(id: string) {
  try {
    await prisma.socialAccount.delete({
      where: { id }
    });
    revalidatePath('/connections');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return { success: false };
  }
}

export async function toggleAccountStatus(id: string, isActive: boolean) {
  try {
    await prisma.socialAccount.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath('/connections');
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle account status:", error);
    return { success: false };
  }
}

export async function saveThreadsConfig(token: string, userId: string) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Simple regex to replace or append
    if (envContent.includes('THREADS_ACCESS_TOKEN=')) {
      envContent = envContent.replace(/THREADS_ACCESS_TOKEN=.*/, `THREADS_ACCESS_TOKEN="${token}"`);
    } else {
      envContent += `\nTHREADS_ACCESS_TOKEN="${token}"`;
    }

    if (envContent.includes('THREADS_USER_ID=')) {
      envContent = envContent.replace(/THREADS_USER_ID=.*/, `THREADS_USER_ID="${userId}"`);
    } else {
      envContent += `\nTHREADS_USER_ID="${userId}"`;
    }

    fs.writeFileSync(envPath, envContent);
    return { success: true };
  } catch (error) {
    console.error("Failed to save Threads config:", error);
    return { success: false };
  }
}
