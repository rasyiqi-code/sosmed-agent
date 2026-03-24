import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { 
  exchangeCodeForToken, 
  exchangeShortToLongLivedToken,
  getThreadsProfile 
} from '@/lib/social/threads';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error("Threads Auth Error:", error);
    return NextResponse.redirect(new URL('/connections?error=' + error, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/connections?error=no_code', request.url));
  }

  try {
    // 1. Exchange code for short-lived token
    const { accessToken: shortToken, userId } = await exchangeCodeForToken(code);

    // 2. Exchange short-lived for long-lived token
    const { accessToken: longToken } = await exchangeShortToLongLivedToken(shortToken);

    // 3. Get profile info
    // We need to temporarily set the token in a way getThreadsProfile can use, 
    // or modify getThreadsProfile to accept a token.
    // For now, let's just fetch it manually here to avoid side effects.
    const profileRes = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${longToken}`);
    const profileData = await profileRes.json();

    if (!profileRes.ok) throw new Error("Failed to fetch profile during OAuth");

    // 4. Update Database
    const persona = await prisma.persona.findFirst();
    if (!persona) throw new Error("No active persona found");

    const existing = await prisma.socialAccount.findFirst({
      where: { personaId: persona.id, platform: 'Threads' }
    });

    if (existing) {
      await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          handle: profileData.username,
          avatarUrl: profileData.threads_profile_picture_url,
          accessToken: longToken,
          externalId: userId,
          isActive: true
        }
      });
    } else {
      await prisma.socialAccount.create({
        data: {
          personaId: persona.id,
          platform: 'Threads',
          handle: profileData.username,
          avatarUrl: profileData.threads_profile_picture_url,
          accessToken: longToken,
          externalId: userId,
          isActive: true
        }
      });
    }

    return NextResponse.redirect(new URL('/connections?success=true', request.url));
  } catch (err: any) {
    console.error("OAuth Callback Failure:", err);
    return NextResponse.redirect(new URL('/connections?error=' + encodeURIComponent(err.message), request.url));
  }
}
