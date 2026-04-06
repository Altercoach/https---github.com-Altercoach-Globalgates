import { NextRequest, NextResponse } from 'next/server';

interface PublishItem {
  platform: string;
  copy: string;
  hashtags: string[];
  scheduledAt: string;
}

interface PublishBody {
  // Optional runtime override; if not provided, env MIXPOST_BASE_URL is used.
  mixpostBaseUrl?: string;
  posts: PublishItem[];
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export async function POST(request: NextRequest) {
  let body: PublishBody;

  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.posts) || body.posts.length === 0) {
    return NextResponse.json({ error: 'posts is required and must be a non-empty array' }, { status: 400 });
  }

  const baseUrl = normalizeBaseUrl(body.mixpostBaseUrl?.trim() || process.env.MIXPOST_BASE_URL || '');
  const apiToken = process.env.MIXPOST_API_TOKEN || '';

  if (!baseUrl) {
    return NextResponse.json(
      {
        error:
          'Mixpost base URL is missing. Set MIXPOST_BASE_URL in .env.local or send mixpostBaseUrl in request body.',
      },
      { status: 400 }
    );
  }

  const endpoint = `${baseUrl}/api/posts`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // If token is configured, send it; if not, rely on local/open setup.
  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  const results: Array<{ platform: string; ok: boolean; status: number; error?: string }> = [];

  for (const post of body.posts) {
    const payload = {
      content: [{ body: `${post.copy}\n\n${post.hashtags.map((h) => `#${h}`).join(' ')}` }],
      date: post.scheduledAt,
      // Many Mixpost installs require account IDs; we preserve platform as tag fallback.
      tags: [post.platform],
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        results.push({
          platform: post.platform,
          ok: false,
          status: res.status,
          error: text.substring(0, 300),
        });
      } else {
        results.push({ platform: post.platform, ok: true, status: res.status });
      }
    } catch (error) {
      results.push({
        platform: post.platform,
        ok: false,
        status: 0,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const sent = results.filter((r) => r.ok).length;

  return NextResponse.json({
    sent,
    total: results.length,
    usedEnvBaseUrl: !body.mixpostBaseUrl,
    usedApiToken: !!apiToken,
    results,
  });
}
