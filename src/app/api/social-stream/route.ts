/**
 * Social Stream Ninja API Routes
 * 
 * Endpoints for managing Social Stream multi-channel communication
 * All endpoints are consolidated into single POST and GET functions
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  setupSocialStreamListener,
  sendResponse,
  blockUser,
  getConnectionStatus,
  getBufferedMessages,
  closeSocialStream,
  sendCommand,
} from '@/ai/flows/social-stream-agent';

const DEFAULT_IN_CHANNEL = 4;
const DEFAULT_OUT_CHANNEL = 2;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parseSafeInt(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampLimit(value: string | null | undefined): number {
  const parsed = parseSafeInt(value, DEFAULT_LIMIT);
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

function sanitizeIdentifier(value: unknown, fallback = 'all'): string {
  if (typeof value !== 'string') return fallback;

  // Allow common username/platform characters and limit size.
  const normalized = value.trim().slice(0, 64).replace(/[^a-zA-Z0-9._:@-]/g, '');
  return normalized.length > 0 ? normalized : fallback;
}

/**
 * POST /api/social-stream
 * Route all POST requests to appropriate handler based on pathname
 */
export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    // POST /api/social-stream/init
    if (pathname.includes('/init')) {
      const sessionId = process.env.SOCIAL_STREAM_SESSION_ID;

      if (!sessionId) {
        return NextResponse.json(
          {
            error: 'SOCIAL_STREAM_SESSION_ID not configured in environment',
            hint: 'Add SOCIAL_STREAM_SESSION_ID to .env.local',
          },
          { status: 400 }
        );
      }

      setupSocialStreamListener({
        sessionId,
        inChannel: parseSafeInt(process.env.SOCIAL_STREAM_IN_CHANNEL, DEFAULT_IN_CHANNEL),
        outChannel: parseSafeInt(process.env.SOCIAL_STREAM_OUT_CHANNEL, DEFAULT_OUT_CHANNEL),
      });

      return NextResponse.json(
        {
          status: 'initialized',
          message: '✅ Social Stream Agent is listening for incoming messages',
          config: {
            sessionId: sessionId.substring(0, 10) + '...',
            inChannel: process.env.SOCIAL_STREAM_IN_CHANNEL || '4',
            outChannel: process.env.SOCIAL_STREAM_OUT_CHANNEL || '2',
          },
        },
        { status: 200 }
      );
    }

    // POST /api/social-stream/send
    if (pathname.includes('/send')) {
      const body = await request.json();
      const message = typeof body?.message === 'string' ? body.message.trim() : '';
      const username = sanitizeIdentifier(body?.username, 'all');
      const platform = sanitizeIdentifier(body?.platform, 'api');

      if (!message) {
        return NextResponse.json(
          { error: 'Message is required' },
          { status: 400 }
        );
      }

      await sendResponse(message, username, platform);

      return NextResponse.json(
        {
          status: 'sent',
          message: '✅ Message sent through Social Stream',
          details: { to: username, platform },
        },
        { status: 200 }
      );
    }

    // POST /api/social-stream/block
    if (pathname.includes('/block')) {
      const body = await request.json();
      const username = sanitizeIdentifier(body?.username, '');
      const platform = sanitizeIdentifier(body?.platform, '');

      if (!username || !platform) {
        return NextResponse.json(
          { error: 'Username and platform are required' },
          { status: 400 }
        );
      }

      await blockUser(username, platform);

      return NextResponse.json(
        {
          status: 'blocked',
          message: `✅ User ${username} blocked on ${platform}`,
        },
        { status: 200 }
      );
    }

    // POST /api/social-stream/command
    if (pathname.includes('/command')) {
      const body = await request.json();
      const { action, value } = body;

      if (!action) {
        return NextResponse.json(
          { error: 'Action is required' },
          { status: 400 }
        );
      }

      await sendCommand(action, value);

      return NextResponse.json(
        {
          status: 'sent',
          message: `✅ Command "${action}" sent`,
          action,
          value,
        },
        { status: 200 }
      );
    }

    // POST /api/social-stream/close
    if (pathname.includes('/close')) {
      closeSocialStream();

      return NextResponse.json(
        {
          status: 'closed',
          message: '✅ Social Stream connection closed',
        },
        { status: 200 }
      );
    }

    // Unknown endpoint
    return NextResponse.json(
      {
        error: 'Unknown POST endpoint',
        availableEndpoints: [
          'POST /api/social-stream/init',
          'POST /api/social-stream/send',
          'POST /api/social-stream/block',
          'POST /api/social-stream/command',
          'POST /api/social-stream/close',
        ],
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Social Stream POST Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/social-stream
 * Route all GET requests to appropriate handler based on pathname
 */
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  try {
    // GET /api/social-stream/status
    if (pathname.includes('/status')) {
      const status = getConnectionStatus();

      return NextResponse.json(
        {
          status: 'success',
          data: status,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // GET /api/social-stream/messages?limit=10
    if (pathname.includes('/messages')) {
      const limit = clampLimit(searchParams.get('limit'));
      const messages = getBufferedMessages(limit);

      return NextResponse.json(
        {
          status: 'success',
          data: {
            count: messages.length,
            limit,
            messages,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // GET /api/social-stream/health
    if (pathname.includes('/health')) {
      const status = getConnectionStatus();
      const isHealthy = status.connected;

      return NextResponse.json(
        {
          status: isHealthy ? 'healthy' : 'unhealthy',
          connected: status.connected,
          bufferedMessages: status.bufferedMessages,
          reconnectAttempts: status.reconnectAttempts,
          timestamp: new Date().toISOString(),
        },
        { status: isHealthy ? 200 : 503 }
      );
    }

    // Unknown endpoint
    return NextResponse.json(
      {
        error: 'Unknown GET endpoint',
        availableEndpoints: [
          'GET /api/social-stream/status',
          'GET /api/social-stream/messages?limit=10',
          'GET /api/social-stream/health',
        ],
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Social Stream GET Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
