/**
 * Official Threads API Client (Graph API)
 * Handles the 2-step media container & publishing flow.
 * Supports Auto-Threading for content > 500 chars.
 */

const THREADS_API_URL = 'https://graph.threads.net/v1.0';

/**
 * Splits text into chunks of max 500 chars, trying to break at sentences or paragraphs.
 */
function splitIntoChunks(text: string, limit: number = 500): string[] {
  if (text.length <= limit) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= limit) {
      chunks.push(remaining);
      break;
    }

    // Try to find a good break point (paragraph or sentence)
    let breakPoint = remaining.lastIndexOf('\n\n', limit);
    if (breakPoint === -1) breakPoint = remaining.lastIndexOf('\n', limit);
    if (breakPoint === -1) breakPoint = remaining.lastIndexOf('. ', limit);
    if (breakPoint === -1) breakPoint = remaining.lastIndexOf(' ', limit);
    if (breakPoint === -1) breakPoint = limit;

    chunks.push(remaining.slice(0, breakPoint).trim());
    remaining = remaining.slice(breakPoint).trim();
  }

  return chunks;
}

async function createContainer(userId: string, accessToken: string, text: string, replyToId?: string) {
  const containerRes = await fetch(`${THREADS_API_URL}/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'TEXT',
      text: text,
      access_token: accessToken,
      ...(replyToId && { reply_to_id: replyToId })
    }),
  });

  const containerData = await containerRes.json();
  if (!containerRes.ok) {
    throw new Error(`Threads Container Error: ${JSON.stringify(containerData)}`);
  }
  return containerData.id;
}

async function publishContainer(userId: string, accessToken: string, creationId: string) {
  const publishRes = await fetch(`${THREADS_API_URL}/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken,
    }),
  });

  const publishData = await publishRes.json();
  if (!publishRes.ok) {
    throw new Error(`Threads Publish Error: ${JSON.stringify(publishData)}`);
  }
  return publishData.id;
}

/**
 * Main function to publish content to Threads.
 * If text > 500 chars, it automatically creates a thread.
 */
export async function publishToThreads(text: string, customToken?: string, customUserId?: string) {
  const accessToken = customToken || process.env.THREADS_ACCESS_TOKEN;
  const userId = customUserId || process.env.THREADS_USER_ID;

  if (!accessToken || !userId) {
    throw new Error("Threads credentials missing (no token in DB and no token in .env)");
  }

  try {
    const chunks = splitIntoChunks(text);
    console.log(`[Threads] Publishing ${chunks.length} post(s)...`);
    
    let lastPostId: string | undefined;
    const publishedIds: string[] = [];

    for (const chunk of chunks) {
      // 1. Create Media Container
      const creationId = await createContainer(userId, accessToken, chunk, lastPostId);
      console.log(`[Threads] Created container for chunk ${publishedIds.length + 1}: ${creationId}`);

      // Optional: Add a small delay for large threads to avoid rate limiting or processing race conditions
      if (publishedIds.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // 2. Publish
      const publishedId = await publishContainer(userId, accessToken, creationId);
      console.log(`[Threads] Successfully published post: ${publishedId}`);
      
      lastPostId = publishedId;
      publishedIds.push(publishedId);
    }

    return { success: true, ids: publishedIds };
  } catch (error: any) {
    console.error("Threads publishing failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getThreadsProfile() {
  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  const userId = process.env.THREADS_USER_ID;

  if (!accessToken || !userId) {
    return { success: false, error: "Threads credentials missing" };
  }

  try {
    const res = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${accessToken}`);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to fetch profile");
    }

    return {
      success: true,
      username: data.username,
      avatarUrl: data.threads_profile_picture_url
    };
  } catch (error: any) {
    console.error("Threads profile fetch failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getThreadsMetrics(mediaId: string) {
  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  if (!accessToken) return { success: false, error: "No token found" };

  try {
    const res = await fetch(`https://graph.threads.net/v1.0/${mediaId}?fields=like_count,reply_count,repost_count,quote_count&access_token=${accessToken}`);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to fetch metrics");
    }

    return {
      success: true,
      metrics: {
        likes: data.like_count || 0,
        replies: data.reply_count || 0,
        reposts: data.repost_count || 0,
        quotes: data.quote_count || 0,
      }
    };
  } catch (error: any) {
    console.error("Threads metrics fetch failed:", error);
    return { success: false, error: error.message };
  }
}
export async function getThreadsAuthUrl() {
  const appId = process.env.THREADS_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/threads/callback`;
  
  if (!appId) throw new Error("THREADS_APP_ID missing");
  
  const scopes = 'threads_basic,threads_content_publish';
  return `https://www.threads.net/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;
}

export async function exchangeCodeForToken(code: string) {
  const appId = process.env.THREADS_APP_ID;
  const appSecret = process.env.THREADS_APP_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/threads/callback`;

  if (!appId || !appSecret) throw new Error("THREADS_APP_ID or THREADS_APP_SECRET missing");

  const formData = new URLSearchParams();
  formData.append('client_id', appId);
  formData.append('client_secret', appSecret);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', redirectUri);
  formData.append('code', code);

  const res = await fetch('https://graph.threads.net/oauth/access_token', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_message || data.error?.message || "Token exchange failed");

  return {
    accessToken: data.access_token,
    userId: data.user_id
  };
}

export async function exchangeShortToLongLivedToken(shortToken: string) {
  const appSecret = process.env.THREADS_APP_SECRET;
  if (!appSecret) throw new Error("THREADS_APP_SECRET missing");

  const res = await fetch(`https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Long-lived token exchange failed");

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in
  };
}
export async function refreshLongLivedToken(longToken: string) {
  const res = await fetch(`https://graph.threads.net/access_token?grant_type=th_refresh_token&access_token=${longToken}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Token refresh failed");

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in
  };
}
