/**
 * LTX-Video-2 API Route
 * 
 * Integrates with Lightricks LTX-Video-2 via HuggingFace Inference API.
 * Model: Lightricks/LTX-Video (Apache-2.0)
 * 
 * When HF_API_TOKEN is not set, returns a demo video URL for preview purposes.
 * 
 * POST /api/generate-video
 * Body: { prompt: string, aspectRatio?: '9:16' | '16:9' | '1:1', durationSeconds?: number }
 */

import { NextRequest, NextResponse } from 'next/server';

// Demo videos from public Google CDN (no auth required)
const DEMO_VIDEOS: Record<string, string> = {
  '9:16': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  '16:9': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '1:1':  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
};

const DIMENSIONS = {
  '9:16': { width: 480,  height: 848 },
  '16:9': { width: 848,  height: 480 },
  '1:1':  { width: 512,  height: 512 },
};

export async function POST(request: NextRequest) {
  let body: { prompt?: string; aspectRatio?: string; durationSeconds?: number };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { prompt, aspectRatio = '9:16', durationSeconds = 5 } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const ratio = (aspectRatio in DIMENSIONS ? aspectRatio : '9:16') as keyof typeof DIMENSIONS;
  const apiToken = process.env.HF_API_TOKEN;

  // ── Demo mode (no HF token) ────────────────────────────────────────────────
  if (!apiToken) {
    return NextResponse.json({
      videoUrl: DEMO_VIDEOS[ratio] ?? DEMO_VIDEOS['9:16'],
      model: 'demo-ltx-video-2 (HF_API_TOKEN not configured)',
      isDemoMode: true,
    });
  }

  // ── Real LTX-Video-2 via HuggingFace Inference API ─────────────────────────
  try {
    const dims = DIMENSIONS[ratio];
    const numFrames = Math.min(durationSeconds * 25, 257); // LTX-Video max ~10s at 25fps

    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/Lightricks/LTX-Video',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: dims.width,
            height: dims.height,
            num_inference_steps: 30,
            num_frames: numFrames,
            guidance_scale: 3.5,
            negative_prompt: 'worst quality, blurry, low resolution, watermark',
          },
        }),
        signal: AbortSignal.timeout(360_000), // 6 min — model can be slow on cold start
      }
    );

    if (!hfResponse.ok) {
      const errText = await hfResponse.text().catch(() => '');
      // If model is loading, return a helpful error
      if (hfResponse.status === 503) {
        return NextResponse.json(
          {
            error: 'LTX-Video-2 está cargando en HuggingFace (puede tardar 1-3 min). Vuelve a intentar.',
            retryAfter: 60,
          },
          { status: 503 }
        );
      }
      throw new Error(`HuggingFace ${hfResponse.status}: ${errText.substring(0, 300)}`);
    }

    const videoBuffer = await hfResponse.arrayBuffer();
    const base64 = Buffer.from(videoBuffer).toString('base64');
    const contentType = hfResponse.headers.get('content-type') ?? 'video/mp4';

    return NextResponse.json({
      videoUrl: `data:${contentType};base64,${base64}`,
      model: 'Lightricks/LTX-Video-2',
      isDemoMode: false,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[generate-video] LTX-Video error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
