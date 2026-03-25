/**
 * Social Stream Ninja API Routes
 * 
 * File: src/app/api/social-stream/route.ts
 * Description: RESTful API for Social Stream Agent integration
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  setupSocialStreamListener,
  closeSocialStream,
  sendCommand,
  sendResponse,
  blockUser,
  clearAllMessages,
  featureNextMessage,
  toggleEmoteOnly,
  getConnectionStatus,
  getBufferedMessages,
} from '@/ai/flows/social-stream-agent';

// ============================================================================
// INIT ENDPOINT: Initialize the agent
// ============================================================================

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // POST /api/social-stream/init
  if (pathname.includes('/init')) {
    try {
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
        inChannel: parseInt(process.env.SOCIAL_STREAM_IN_CHANNEL || '4'),
        outChannel: parseInt(process.env.SOCIAL_STREAM_OUT_CHANNEL || '2'),
      });

      return NextResponse.json(
        {
          status: 'initialized',
          message: 'Social Stream Agent is listening for incoming messages',
          config: {
            sessionId: sessionId.substring(0, 10) + '...',
            inChannel: process.env.SOCIAL_STREAM_IN_CHANNEL || '4',
            outChannel: process.env.SOCIAL_STREAM_OUT_CHANNEL || '2',
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error initializing Social Stream:', error);
      return NextResponse.json(
        {
          error: 'Failed to initialize Social Stream Agent',
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  // POST /api/social-stream/send
  if (pathname.includes('/send')) {
    try {
      const body = await request.json();
      const { message, username = 'all', platform = 'api' } = body;

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
          message: 'Message sent through Social Stream',
          details: {
            to: username,
            platform,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
  }

  // POST /api/social-stream/block
  if (pathname.includes('/block')) {
    try {
      const body = await request.json();
      const { username, platform } = body;

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
          message: `User ${username} blocked on ${platform}`,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error blocking user:', error);
      return NextResponse.json(
        { error: 'Failed to block user' },
        { status: 500 }
      );
    }
  }

  // POST /api/social-stream/clear
  if (pathname.includes('/clear')) {
    try {
      await clearAllMessages();

      return NextResponse.json(
        {
          status: 'cleared',
          message: 'All messages cleared from display',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error clearing messages:', error);
      return NextResponse.json(
        { error: 'Failed to clear messages' },
        { status: 500 }
      );
    }
  }

  // POST /api/social-stream/feature
  if (pathname.includes('/feature')) {
    try {
      await featureNextMessage();

      return NextResponse.json(
        {
          status: 'featured',
          message: 'Next message featured',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error featuring message:', error);
      return NextResponse.json(
        { error: 'Failed to feature message' },
        { status: 500 }
      );
    }
  }

  // POST /api/social-stream/toggle-emote
  if (pathname.includes('/toggle-emote')) {
    try {
      await toggleEmoteOnly();

      return NextResponse.json(
        {
          status: 'toggled',
          message: 'Emote-only mode toggled',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error toggling emote mode:', error);
      return NextResponse.json(
        { error: 'Failed to toggle emote mode' },
        { status: 500 }
      );
    }
  }

  // POST /api/social-stream/command
  if (pathname.includes('/command')) {
    try {
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
          message: `Command "${action}" sent`,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error sending command:', error);
      return NextResponse.json(
        { error: 'Failed to send command' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Unknown endpoint' },
    { status: 404 }
  );
}

// ============================================================================
// GET ENDPOINTS: Retrieve data
// ============================================================================

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // GET /api/social-stream/status
  if (pathname.includes('/status')) {
    try {
      const status = getConnectionStatus();

      return NextResponse.json(
        {
          status: 'success',
          data: status,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error getting status:', error);
      return NextResponse.json(
        { error: 'Failed to get status' },
        { status: 500 }
      );
    }
  }

  // GET /api/social-stream/messages?limit=10
  if (pathname.includes('/messages')) {
    try {
      const limit = parseInt(searchParams.get('limit') || '10');

      const messages = getBufferedMessages(limit);

      return NextResponse.json(
        {
          status: 'success',
          data: {
            count: messages.length,
            messages,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error getting messages:', error);
      return NextResponse.json(
        { error: 'Failed to get messages' },
        { status: 500 }
      );
    }
  }

  // GET /api/social-stream/health
  if (pathname.includes('/health')) {
    try {
      const status = getConnectionStatus();

      return NextResponse.json(
        {
          status: status.connected ? 'healthy' : 'unhealthy',
          connected: status.connected,
          reconnectAttempts: status.reconnectAttempts,
        },
        { status: status.connected ? 200 : 503 }
      );
    } catch (error) {
      return NextResponse.json(
        { status: 'unhealthy', error: String(error) },
        { status: 503 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Unknown endpoint' },
    { status: 404 }
  );
}

// ============================================================================
// DELETE ENDPOINT: Cleanup
// ============================================================================

export async function DELETE(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // DELETE /api/social-stream/close
  if (pathname.includes('/close')) {
    try {
      closeSocialStream();

      return NextResponse.json(
        {
          status: 'closed',
          message: 'Social Stream connection closed',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error closing connection:', error);
      return NextResponse.json(
        { error: 'Failed to close connection' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Unknown endpoint' },
    { status: 404 }
  );
}
