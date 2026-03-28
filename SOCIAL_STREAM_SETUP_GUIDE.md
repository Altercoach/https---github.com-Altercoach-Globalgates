# 🚀 Setup Guide: Social Stream Ninja Integration

## Quick Start for Keruxia

### Step 1: Install Social Stream Ninja

#### Option A: Browser Extension (Recommended for Development)
1. Go to https://github.com/steveseguin/social_stream/releases
2. Download the `.crx` or `.zip` file
3. Chrome: Settings → Extensions → Load unpacked (select folder)
4. Firefox: about:debugging → Load temporary add-on

#### Option B: Standalone Desktop App
```bash
# Download from GitHub releases
# https://github.com/steveseguin/social_stream/releases

# Extract and run
./SocialStreamNinja
```

### Step 2: Generate Session ID

1. **Open Social Stream Ninja** (extension or app)
2. **Menu → Settings → Global settings and tools**
3. **Mechanics section:**
   - ✅ Enable: "Enable remote API control of extension"
   - ✅ Enable: "Send chat messages to API server (3rd toggle)"
4. **Copy Session ID** from API section
5. **Save to `.env`:**

```env
# .env.local
SOCIAL_STREAM_SESSION_ID=your_session_id_here
SOCIAL_STREAM_BASE_URL=https://your-social-stream-url
SOCIAL_STREAM_IN_CHANNEL=4     # Channel for incoming messages
SOCIAL_STREAM_OUT_CHANNEL=2    # Channel for outgoing responses
```

### Step 3: Configure Channels in Social Stream

#### WhatsApp
```
Social Stream Menu → Settings → Chat Channels
→ Add → WhatsApp (or Twilio WhatsApp)
→ Follow OAuth flow
→ Messages will flow to API server on Channel 4
```

#### Email
```
Social Stream Menu → Settings → Email
→ IMAP configuration
→ Or: Forward to webhook
```

#### Discord, Slack, Telegram
```
Social Stream Menu → Settings → Integrations
→ Toggle enable for Discord/Slack/Telegram
→ Link your account
```

#### Custom Webhook
```
POST https://your-social-stream-url/{SESSION_ID}/sendChat/null/{MESSAGE}
```

### Step 4: Install Keruxia Dependencies

```bash
# Already included in package.json
npm install ws  # WebSocket client

# If not installed:
npm install --save ws
npm install --save-dev @types/ws
```

### Step 5: Initialize Agent in Keruxia

#### File: `src/app/api/social-stream/init/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { initializeSocialStreamFlow } from '@/ai/flows/social-stream-agent';

export async function POST(request: NextRequest) {
  try {
    const sessionId = process.env.SOCIAL_STREAM_SESSION_ID;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'SOCIAL_STREAM_SESSION_ID not configured' },
        { status: 400 }
      );
    }

      SOCIAL_STREAM_SESSION_ID=xxxxx
      SOCIAL_STREAM_BASE_URL=https://your-social-stream-url
      SOCIAL_STREAM_IN_CHANNEL=4     # Channel for incoming messages
      SOCIAL_STREAM_OUT_CHANNEL=2    # Channel for outgoing responses
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error initializing Social Stream:', error);
    return NextResponse.json(
      { error: 'Failed to initialize' },
      { status: 500 }
    );
  }
}
```
    -e SOCIAL_STREAM_BASE_URL=https://your-social-stream-url \

#### File: `src/app/page.tsx` (or wherever app starts)

```typescript
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Initialize Social Stream Agent on app load
    fetch('/api/social-stream/init', { method: 'POST' });
  }, []);

  return (
    <main>
      {/* Your app content */}
    </main>
  );
}
```

### Step 6: Test Connection

#### Test Endpoint: `src/app/api/social-stream/status/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getConnectionStatus } from '@/ai/flows/social-stream-agent';

export async function GET() {
  const status = getConnectionStatus();
  return NextResponse.json(status, { status: 200 });
}
```

#### Test in Browser
```bash
curl http://localhost:3000/api/social-stream/status
```

**Expected Response:**
```json
{
  "connected": true,
  "sessionId": "xxxxxxxx",
  "bufferedMessages": 0,
  "reconnectAttempts": 0
}
```

---

## Environment Variables

Create `.env.local`:

```env
# Social Stream Ninja
SOCIAL_STREAM_SESSION_ID=your_session_id_here
SOCIAL_STREAM_BASE_URL=https://your-social-stream-url
SOCIAL_STREAM_IN_CHANNEL=4     # Channel for incoming messages
SOCIAL_STREAM_OUT_CHANNEL=2    # Channel for outgoing responses

# Genkit AI
GENKIT_PLUGINS=@genkit-ai/google-genai
GENKIT_ENVIRONMENT=dev
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config

# App Config
ENVIRONMENT=development
LOG_LEVEL=debug
```

---

## API Endpoints

### Health Check
```bash
GET /api/social-stream/status

# Response:
{
  "connected": true,
  "sessionId": "xxxxx",
  "bufferedMessages": 0,
  "reconnectAttempts": 0
}
```

### Send Message
```bash
POST /api/social-stream/send
Content-Type: application/json

{
  "message": "Hello from Keruxia!",
  "username": "optional_target",
  "platform": "whatsapp"  // or 'discord', 'slack', etc.
}
```

### Block User
```bash
POST /api/social-stream/block
Content-Type: application/json

{
  "username": "spam_user",
  "platform": "discord"
}
```

### Get Messages
```bash
GET /api/social-stream/messages?limit=10

# Response:
[
  {
    "chatname": "user123",
    "chatmessage": "Hello AI!",
    "type": "discord",
    "timestamp": 1711270000000
  },
  ...
]
```

---

## Testing

### 1. Manual Test with cURL

```bash
# Initialize agent
curl -X POST http://localhost:3000/api/social-stream/init

# Check status
curl http://localhost:3000/api/social-stream/status

# Send test message
curl -X POST http://localhost:3000/api/social-stream/send \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message!", "platform": "api"}'
```

### 2. Test with Social Stream Sandbox

Go to: https://socialstream.ninja/sampleapi.html?session=YOUR_SESSION_ID

1. Fill in Channel: `4` (in), `2` (out)
2. Click "Connect"
3. Type message in "Send Chat Message" section
4. Should appear in your app

### 3. Unit Test Example

```typescript
// src/ai/flows/__tests__/social-stream-agent.test.ts

import { getConnectionStatus } from '../social-stream-agent';

describe('Social Stream Agent', () => {
  it('should return connection status', () => {
    const status = getConnectionStatus();
    
    expect(status).toHaveProperty('connected');
    expect(status).toHaveProperty('sessionId');
    expect(status).toHaveProperty('bufferedMessages');
  });
});
```

---

## Troubleshooting

### Issue: "WebSocket connection failed"

**Cause:** SESSION_ID is invalid or expired

**Solution:**
1. Restart Social Stream Ninja
2. Copy fresh SESSION_ID
3. Update `.env.local`
4. Restart Next.js dev server

### Issue: "CORS error"

**Cause:** Direct browser access to Social Stream

**Solution:**
- Use backend API routes (which this guide provides)
- Don't call WebSocket from browser directly

### Issue: "No messages received"

**Cause:** Social Stream not configured for API

**Solution:**
1. Open Social Stream Settings
2. Check "Enable remote API control" is enabled
3. Check "Send chat messages to API server" is enabled
4. Verify Channel 4 is set as IN_CHANNEL

### Issue: "Session ID keeps changing"

**Info:** This is normal behavior for Social Stream
- Each browser session generates new ID
- Use one stable session for your app

---

## Performance Optimization

### Message Buffering
```typescript
// Agent buffer size is 100 messages by default
// Change in social-stream-agent.ts:

const MAX_BUFFER_SIZE = 100;  // ← Adjust this
```

### Timeout & Reconnection
```typescript
const RECONNECT_INTERVAL = 5000;      // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 10;    // 10 attempts
```

### Database Integration (Optional)

Store conversations in Firebase:

```typescript
// Add to handleIncomingMessage()
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  await storeConversation({
    userId: chatname,
    message: chatmessage,
    response: aiResponse.text,
    platform: type,
    timestamp: new Date(),
  });
}
```

---

## Monitoring & Logging

### Enable Detailed Logs

Update `.env.local`:
```env
LOG_LEVEL=debug
DEBUG=social-stream:*
```

### Metrics to Track

1. **Message latency:** From incoming → response time
2. **Success rate:** Messages processed successfully
3. **Error rate:** Failed message processing
4. **Reconnections:** How often agent reconnects

---

## Deployment

### Vercel Deployment

```bash
# 1. Add environment variables in Vercel dashboard
SOCIAL_STREAM_SESSION_ID=xxxxx
SOCIAL_STREAM_BASE_URL=https://your-social-stream-url

# 2. Deploy
vercel --prod

# 3. Test
curl https://your-app.vercel.app/api/social-stream/status
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV SOCIAL_STREAM_SESSION_ID=${SOCIAL_STREAM_SESSION_ID}
ENV ENVIRONMENT=production

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t keruxia-social-stream .

docker run -e SOCIAL_STREAM_SESSION_ID=xxxxx \
  -p 3000:3000 \
  keruxia-social-stream
```

---

## Advanced Features

### Multi-Agent Setup

Run multiple agents on different channels:

```typescript
// Agent 1: WhatsApp
setupSocialStreamListener({
  sessionId: process.env.SOCIAL_STREAM_SESSION_ID_1,
  inChannel: 4,
  outChannel: 2,
});

// Agent 2: Discord
setupSocialStreamListener({
  sessionId: process.env.SOCIAL_STREAM_SESSION_ID_2,
  inChannel: 4,
  outChannel: 2,
});
```

### Custom Message Processing

Override `generateAIResponse()`:

```typescript
async function generateAIResponse(
  message: string,
  username: string,
  platform: string
): Promise<AIResponse> {
  // Call your Genkit flow
  const result = await chatFlow({
    userMessage: message,
    context: { username, platform },
  });

  return {
    text: result.response,
    metadata: {
      confidence: result.confidence,
      source: 'genkit-flow',
    },
  };
}
```

### Rate Limiting

```typescript
const rateLimiter = new Map<string, number>();

async function handleIncomingMessage(message: IncomingMessage) {
  const userKey = `${message.chatname}-${message.type}`;
  const now = Date.now();
  const lastMessage = rateLimiter.get(userKey) || 0;

  if (now - lastMessage < 1000) {  // 1 second between messages
    console.warn(⏱️ Rate limit: ${userKey});
    return;
  }

  rateLimiter.set(userKey, now);
  // ... process message
}
```

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Test connection with status endpoint
3. ✅ Customize `generateAIResponse()` with Genkit flows
4. ✅ Add database integration (Firebase, etc.)
5. ✅ Deploy to production
6. ✅ Monitor and optimize

---

## Support & Resources

- **Social Stream Ninja Docs:** https://github.com/steveseguin/social_stream/blob/master/api.md
- **API Sandbox:** https://socialstream.ninja/sampleapi.html
- **Discord Community:** @socialstream.discord.vdo
- **GitHub Issues:** https://github.com/steveseguin/social_stream/issues

---

**Last Updated:** March 25, 2026
**Version:** 1.0
