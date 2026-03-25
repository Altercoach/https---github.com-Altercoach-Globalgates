# API Reference: Social Stream Integration Endpoints

## Base URL
```
http://localhost:3000/api/social-stream
(or your production domain)
```

---

## Endpoints Summary

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/init` | Initialize agent | ✅ |
| POST | `/send` | Send message | ✅ |
| POST | `/block` | Block user | ✅ |
| POST | `/clear` | Clear display | ✅ |
| POST | `/feature` | Feature message | ✅ |
| POST | `/toggle-emote` | Toggle emote mode | ✅ |
| POST | `/command` | Send raw command | ✅ |
| GET | `/status` | Get connection status | ✅ |
| GET | `/messages` | Get buffered messages | ✅ |
| GET | `/health` | Health check | ✅ |
| DELETE | `/close` | Close connection | ✅ |

---

## Detailed Endpoints

### 1. Initialize Agent
```http
POST /api/social-stream/init

Response:
{
  "status": "initialized",
  "message": "Social Stream Agent is listening for incoming messages",
  "config": {
    "sessionId": "xxxxxxx...",
    "inChannel": "4",
    "outChannel": "2"
  }
}
```

### 2. Send Message
```http
POST /api/social-stream/send
Content-Type: application/json

Request Body:
{
  "message": "Hello from Keruxia AI!",
  "username": "john_doe",  // optional
  "platform": "whatsapp"   // optional: whatsapp, discord, slack, etc.
}

Response:
{
  "status": "sent",
  "message": "Message sent through Social Stream",
  "details": {
    "to": "john_doe",
    "platform": "whatsapp"
  }
}
```

### 3. Block User
```http
POST /api/social-stream/block
Content-Type: application/json

Request Body:
{
  "username": "spam_user",
  "platform": "discord"
}

Response:
{
  "status": "blocked",
  "message": "User spam_user blocked on discord"
}
```

### 4. Clear All Messages
```http
POST /api/social-stream/clear

Response:
{
  "status": "cleared",
  "message": "All messages cleared from display"
}
```

### 5. Feature Next Message
```http
POST /api/social-stream/feature

Response:
{
  "status": "featured",
  "message": "Next message featured"
}
```

### 6. Toggle Emote-Only Mode
```http
POST /api/social-stream/toggle-emote

Response:
{
  "status": "toggled",
  "message": "Emote-only mode toggled"
}
```

### 7. Send Raw Command
```http
POST /api/social-stream/command
Content-Type: application/json

Request Body:
{
  "action": "sendChat",
  "value": "Your message here"
}

Supported Actions:
- sendChat: Send message
- blockUser: Block user (with value: { chatname, type })
- toggleVIP: Toggle VIP (with value: { chatname, type })
- clearAll: Clear all messages
- nextInQueue: Next in queue
- drawmode: Toggle draw mode
- emoteonly: Toggle emote-only

Response:
{
  "status": "sent",
  "message": "Command \"sendChat\" sent"
}
```

### 8. Get Connection Status
```http
GET /api/social-stream/status

Response:
{
  "status": "success",
  "data": {
    "connected": true,
    "sessionId": "xxxxx",
    "bufferedMessages": 3,
    "reconnectAttempts": 0
  }
}
```

### 9. Get Buffered Messages
```http
GET /api/social-stream/messages?limit=10

Query Parameters:
- limit (optional): Number of messages to return (default: 10)

Response:
{
  "status": "success",
  "data": {
    "count": 3,
    "messages": [
      {
        "chatname": "user123",
        "chatmessage": "Hello AI!",
        "type": "discord",
        "timestamp": 1711270000000
      },
      ...
    ]
  }
}
```

### 10. Health Check
```http
GET /api/social-stream/health

Response (Connected):
{
  "status": "healthy",
  "connected": true,
  "reconnectAttempts": 0
}

Response (Disconnected):
{
  "status": "unhealthy",
  "connected": false,
  "reconnectAttempts": 3
}
```

### 11. Close Connection
```http
DELETE /api/social-stream/close

Response:
{
  "status": "closed",
  "message": "Social Stream connection closed"
}
```

---

## Example Usage: cURL

### Initialize
```bash
curl -X POST http://localhost:3000/api/social-stream/init

# Response:
# {"status":"initialized","message":"Social Stream Agent is listening..."}
```

### Send Message
```bash
curl -X POST http://localhost:3000/api/social-stream/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola! Bienvenido a Keruxia",
    "username": "john",
    "platform": "whatsapp"
  }'

# Response:
# {"status":"sent","message":"Message sent through Social Stream","details":{...}}
```

### Check Status
```bash
curl http://localhost:3000/api/social-stream/status

# Response:
# {"status":"success","data":{"connected":true,"sessionId":"xxxxx",...}}
```

### Get Recent Messages
```bash
curl "http://localhost:3000/api/social-stream/messages?limit=5"

# Response:
# {"status":"success","data":{"count":3,"messages":[...]}}
```

### Block User
```bash
curl -X POST http://localhost:3000/api/social-stream/block \
  -H "Content-Type: application/json" \
  -d '{
    "username": "spammer",
    "platform": "discord"
  }'

# Response:
# {"status":"blocked","message":"User spammer blocked on discord"}
```

---

## JavaScript/TypeScript Client

### Fetch API
```typescript
// Initialize
const initRes = await fetch('/api/social-stream/init', {
  method: 'POST',
});
const initData = await initRes.json();

// Send message
const sendRes = await fetch('/api/social-stream/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    username: 'john',
    platform: 'whatsapp',
  }),
});
const sendData = await sendRes.json();

// Check status
const statusRes = await fetch('/api/social-stream/status');
const statusData = await statusRes.json();

console.log('Connected:', statusData.data.connected);
```

### Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/social-stream',
});

// Initialize
await api.post('/init');

// Send message
await api.post('/send', {
  message: 'Hello!',
  username: 'john',
  platform: 'whatsapp',
});

// Get status
const { data } = await api.get('/status');
console.log('Connected:', data.data.connected);
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Message is required"
}
```

### 404 Not Found
```json
{
  "error": "Unknown endpoint"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to send message",
  "details": "WebSocket not connected"
}
```

### 503 Service Unavailable
```json
{
  "status": "unhealthy",
  "error": "Connection lost"
}
```

---

## WebSocket Messages (Internal)

Social Stream uses JSON messages over WebSocket:

### Send Chat
```json
{
  "action": "sendChat",
  "value": "Your message here"
}
```

### Block User
```json
{
  "action": "blockUser",
  "value": {
    "chatname": "username",
    "type": "twitch"
  }
}
```

### Clear All
```json
{
  "action": "clearAll"
}
```

### Feature Message
```json
{
  "action": "feature",
  "value": "username"
}
```

---

## Rate Limiting (Recommended)

Implement client-side rate limiting to prevent spam:

```typescript
const rateLimiter = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // 1 message per second per user

function canSendMessage(userId: string): boolean {
  const lastSent = rateLimiter.get(userId) || 0;
  const now = Date.now();
  
  if (now - lastSent < RATE_LIMIT_MS) {
    return false;
  }
  
  rateLimiter.set(userId, now);
  return true;
}
```

---

## Monitoring & Logging

### Log Levels
- `debug`: All WebSocket messages
- `info`: Connection status changes
- `warn`: Rate limit exceeded
- `error`: Connection failures

### Environment Variables
```env
LOG_LEVEL=debug
DEBUG=social-stream:*
```

---

## Performance Metrics

Monitor these metrics:

```typescript
interface Metrics {
  messagesProcessed: number;
  messagesPerMinute: number;
  averageResponseTime: number;
  failureRate: number;
  reconnections: number;
  bufferSize: number;
}
```

---

## Debugging

### Check Connection
```bash
curl http://localhost:3000/api/social-stream/status
```

### View Recent Messages
```bash
curl http://localhost:3000/api/social-stream/messages?limit=20
```

### Check Health
```bash
curl http://localhost:3000/api/social-stream/health
```

### Enable Debug Logs
```bash
DEBUG=social-stream:* npm run dev
```

---

## Compatibility

| Platform | Status | Notes |
|----------|--------|-------|
| Node.js | ✅ | 16+ |
| Next.js | ✅ | 13+ |
| Vercel | ✅ | Serverless |
| Docker | ✅ | Docker deployment |
| Cloudflare Workers | ⚠️ | No WebSocket |

---

**Last Updated:** March 25, 2026  
**API Version:** 1.0
