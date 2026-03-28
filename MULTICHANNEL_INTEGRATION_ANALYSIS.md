# 📊 Análisis de Integración Multicanal para Keruxia

## Comparación: Social Stream Ninja vs Chatwoot

---

## 🎯 Resumen Ejecutivo

Para Keruxia (SaaS de marketing con IA en Next.js), **se recomienda SOCIAL STREAM NINJA** como solución principal, con Chatwoot como dashboard opcional secundario.

| Criterio | Social Stream | Chatwoot | Ganador |
|----------|---------------|----------|--------|
| **Para Agent IA Real-time** | ✅✅✅ | ❌ | **Social Stream** |
| **WebSocket/Real-time** | ✅ Nativo | ❌ REST básico | **Social Stream** |
| **Facilidad integración Next.js** | ✅ Muy fácil | ⚠️ Compleja | **Social Stream** |
| **Canales soportados** | ✅ 120+ | ⚠️ 15+ | **Social Stream** |
| **Dashboard de soporte** | ❌ No | ✅✅✅ | **Chatwoot** |
| **Gestión de equipo** | ❌ No | ✅✅✅ | **Chatwoot** |
| **For Streaming/Influencers** | ✅✅✅ | ❌ | **Social Stream** |
| **Costo total** | 💰 Gratis | 💰 Gratis | Empate |
| **Documentación** | ✅ Muy buena | ✅ Excelente | Empate |
| **Comunidad** | ⚠️ Pequeña | ✅ Grande | **Chatwoot** |

---

## 1️⃣ SOCIAL STREAM NINJA

### 📋 Descripción General

**Social Stream Ninja** es una herramienta de agregación de chat en vivo que:
- Consolida mensajes de **120+ plataformas**
- Proporciona WebSocket bidireccional en tiempo real
- Funciona como extensión del navegador + app standalone
- Tiene API HTTP y WebSocket abiertos

**Ideal para:** Agentes IA, automation, streamers, multi-chat aggregation

### 🔌 Integraciones de Canales

| Categoría | Plataformas |
|-----------|-----------|
| **Streaming** | Twitch, YouTube Live, Facebook Live, Kick, Rumble, DLive, Trovo |
| **Redes Sociales** | TikTok, Discord, Twitter/X, Instagram, Telegram, WhatsApp, Slack |
| **Profesionales** | Email, Zoom, Google Meet, MS Teams |
| **Blockchain** | Odysee, Bilibili, VPZone |
| **Webhooks** | Ko-Fi, Stripe, Buy Me A Coffee, Fourthwall |

### 🔌 APIs Disponibles

#### 1. WebSocket API (Bidireccional) ⭐⭐⭐
```javascript
// Conexión
const ws = new WebSocket("wss://io.socialstream.ninja/join/SESSION_ID/4/2");

// Recibir mensajes
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message); // { chatname, chatmessage, type, etc. }
};

// Enviar respuesta
ws.send(JSON.stringify({
  action: "sendChat",
  value: "Hello from your AI agent!"
}));

// Otros comandos
ws.send(JSON.stringify({ action: "blockUser", value: { chatname: "user", type: "twitch" } }));
ws.send(JSON.stringify({ action: "clearAll" }));
ws.send(JSON.stringify({ action: "nextInQueue" }));
```

**Canales disponibles:**
- Canal 1: Comunicación general (default)
- Canal 2: Dock (dashboard)
- Canal 3: Extension commands
- **Canal 4: Chat messages (lo que necesitas para IA)** ⭐
- Canal 5: Waitlist
- Canales 6-9: Uso futuro

#### 2. HTTP/REST API
```bash
# Enviar chat
GET https://io.socialstream.ninja/SESSION_ID/sendChat/null/Hello%20World?channel=1

# Limpiar
GET https://io.socialstream.ninja/SESSION_ID/clearAll

# Siguiente en queue
GET https://io.socialstream.ninja/SESSION_ID/nextInQueue
```env
SOCIAL_STREAM_SESSION_ID=your_session_id_here
```

# Featured message
GET https://io.socialstream.ninja/SESSION_ID/feature/USER/null
```

#### 3. Server-Sent Events (SSE)
```javascript
const eventSource = new EventSource('https://io.socialstream.ninja/sse/SESSION_ID');
eventSource.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
```

#### 4. Webhooks Inbound
```
Stripe: https://io.socialstream.ninja/SESSION_ID/stripe
Ko-Fi: https://io.socialstream.ninja/SESSION_ID/kofi
Buy Me A Coffee: https://io.socialstream.ninja/SESSION_ID/bmac
Fourthwall: https://io.socialstream.ninja/SESSION_ID/fourthwall
```

### 📚 Documentación

- **README.md:** 1000+ líneas, muy detallado
- **API.md:** Documentación completa
- **Sandbox interactivo:** https://socialstream.ninja/sampleapi.html?session=YOUR_ID
- **Guías:** StreamDeck, Bitfocus Companion, YouTube setup, IRC
- **GitHub:** steveseguin/social_stream (bien mantenido)

### ✅ Ventajas para Keruxia

1. **WebSocket real-time** → Perfecto para agent IA
2. **Canales numéricos** → Fácil routing (canal 4 = entrada, canal 2 = salida)
3. **Integración ligera** → Node.js WebSocket, cabe en Next.js
4. **Sin login requerido** → Solo SESSION_ID (setup simple)
5. **120+ canales** → Escalable a futuro
6. **LLM nativo** → Soporta Ollama, OpenAI, xAI, AWS, Gemini
7. **Gratis** → Solo servidor centralizado (gratuito)
8. **RAG & Custom instructions** → Para IA personalizado
9. **Webhooks para donaciones** → Monetización

### ❌ Desventajas

1. Enfoque original en streamers (no "enterprise")
2. Sin dashboard de soporte al cliente
3. No gestión de equipo
4. API sin autenticación robusta (SESSION_ID = contraseña)
5. Documentación dispersa

---

## 2️⃣ CHATWOOT

### 📋 Descripción General

**Chatwoot** es una **plataforma completa de soporte al cliente**:
- Omnicanal (15+ canales profesionales)
- Dashboard de agentes
- Reportes y analytics
- Automatización con IA (Captain)
- Open-source (Rails + Vue 3)

**Ideal para:** Equipos de soporte, customer service, ticketing

### 🔌 Integraciones de Canales

| Tipo | Canales |
|------|---------|
| **Live Chat** | Website (Web Widget), Messenger |
| **Email** | SMTP/IMAP nativo |
| **Social** | Facebook, Instagram, Twitter, TikTok |
| **Messaging** | WhatsApp (Cloud/Twilio/360Dialog), Telegram, Line, SMS |
| **Custom** | API Channel, webhooks |
| **Integraciones** | Slack, Shopify, Linear, Dialogflow |

### 🔌 APIs Disponibles

#### 1. REST API (Estándar)
```javascript
// Crear conversación
POST /api/v1/accounts/{accountId}/conversations
{ contact_id, inbox_id }

// Obtener conversaciones
GET /api/v1/accounts/{accountId}/conversations?inbox_id=7

// Enviar mensaje
POST /api/v1/accounts/{accountId}/conversations/{id}/messages
{
SOCIAL_STREAM_SESSION_ID=your_session_id_here
  message_type: "outgoing",
  private: false
}

// Actualizar conversación
PATCH /api/v1/accounts/{accountId}/conversations/{id}
{ status: "resolved", assignee_id: 5 }
```

#### 2. Web Widget SDK
```html
<script>
  (function(d,t) {
    var g=d.createElement(t), s=d.getElementsByTagName(t)[0];
    g.src="https://your-domain/packs/js/sdk.js";
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: 'YOUR_TOKEN',
        baseUrl: 'https://your-domain'
      })
    }
    s.parentNode.insertBefore(g,s);
  })(document,"script");
</script>
```

#### 3. Webhooks & HMAC
```javascript
// HMAC para validar webhooks
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', secretKey)
  .update(payload)
  .digest('hex');
```

### 📚 Documentación

- **Help Center:** https://www.chatwoot.com/help-center
- **Documentación oficial:** docs.chatwoot.com
- **GitHub:** chatwoot/chatwoot (muy activo)
- **Guides:** Email setup, WhatsApp integration, Web Widget

### ✅ Ventajas para Keruxia

1. **Dashboard profesional** → Para gestión manual
2. **Múltiples WhatsApp** → Cloud, Twilio, 360Dialog
3. **Captain (IA)** → Automación pre-integrada
4. **Reportes** → Analytics y CSAT
5. **Web Widget** → Chat integrado en sitio
6. **Escalable enterprise** → Para equipos grandes
7. **Help Center** → Documentación integrada
8. **Integraciones** → Slack, Shopify, Linear
9. **Gratis self-hosted** → Docker/Kubernetes

### ❌ Desventajas

1. **No real-time optimizado** → REST, no WebSocket
2. **Arquitectura pesada** → Rails + PostgreSQL + Redis
3. **Curva aprendizaje** → UI compleja
4. **Menos modular** → Todo o nada
5. **No ideal para IA agent** → Diseñado para humanos
6. **Excesivo para chat aggregation** → 120 canales sería killing
7. **Performance** → Overhead para IA real-time

---

## 🏗️ Arquitectura Recomendada para Keruxia

### Opción 1: Social Stream Ninja (RECOMENDADO)

```
┌─────────────────────────────────────────────────────────┐
│              KERUXIA (Next.js + Genkit)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Genkit AI Flows                          │   │
│  │  - analyze-business-evaluation                   │   │
│  │  - chat-flow (MEJORADO CON SOCIAL STREAM)        │   │
│  │  - generate-content-schedule                     │   │
│  └───────────────┬──────────────────────────────────┘   │
│                  │                                       │
│  ┌───────────────▼──────────────────────────────────┐   │
│  │  Social Stream Agent (Agent AI Real-time)       │   │
│  │  - Channel 4: Entrada (recibe chats)            │   │
│  │  - Channel 2: Salida (envía respuestas)         │   │
│  │  - WebSocket listener                           │   │
│  │  - Message mapping (WhatsApp→IA→response)       │   │
│  └───────────────┬──────────────────────────────────┘   │
│                  │                                       │
│  ┌───────────────▼──────────────────────────────────┐   │
│  │      src/ai/flows/chat-flow.ts (NUEVO)          │   │
│  │  - setupSocialStreamListener()                   │   │
│  │  - handleIncomingMessage()                       │   │
│  │  - sendResponse()                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────┬─────────────────────────────────────┘
                   │
                   │ WebSocket
                   │ wss://io.socialstream.ninja
                   │
        ┌──────────▼──────────┐
        │  SOCIAL STREAM      │
        │  Central Server     │
        │  (Gratuito)         │
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────────────────────────┐
        │                                          │
    ┌───▼────┐  ┌───────┐  ┌──────┐  ┌─────────┐ │
    │WhatsApp│  │ Email │  │ Slack│  │ Discord │ │
    └────────┘  └───────┘  └──────┘  └─────────┘ │
                                                  │
                     + 116 más plataformas
```

### Opción 2: Chatwoot + Social Stream (HYBRID)

```
┌─────────────────────────────────────────────────────────┐
│              KERUXIA (Next.js)                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Lado IA (Agent Automático)         Lado Soporte (Humano)
│  ┌──────────────────────────────┐  ┌──────────────────┐ │
│  │  Genkit Flows + Social Stream │  │  Chatwoot       │ │
│  │  (Real-time automation)       │  │  Dashboard      │ │
│  │                              │  │  (Manual mgmt)  │ │
│  └──────────────┬───────────────┘  └────────┬─────────┘ │
│                 │                           │            │
└─────────────────┼───────────────────────────┼────────────┘
                  │                           │
                  │ WebSocket                 │ REST API
                  │                           │
        ┌─────────▼──────────┐        ┌───────▼──────────┐
        │ Social Stream       │        │ Chatwoot         │
        │ (Aggregation)       │        │ (Management)     │
        └────────┬────────────┘        └──────┬───────────┘
                 │                            │
        Messages │                            │ Dashboard
        from:    │                            │
        WhatsApp │                            │
        Email    │                            │
        Slack    │                            │
        Discord  │         (Opcional sharing) │
        etc...   │◄─────────────────────────►│
```

---

## 💻 Implementación Paso a Paso

### Fase 1: Setup Social Stream Ninja

#### 1. Instalar Social Stream (Extensión Navegador)
```bash
# Chrome Web Store o GitHub
# https://github.com/steveseguin/social_stream
```

#### 2. Obtener SESSION_ID
- Abre Social Stream
- Settings → Global settings and tools → API
- Copia el SESSION_ID
- Configura en `.env`:
```env
SOCIAL_STREAM_SESSION_ID=xxxxx
SOCIAL_STREAM_BASE_URL=https://io.socialstream.ninja
```

#### 3. Crear flow de integración
Archivo: `src/ai/flows/social-stream-agent.ts`

```typescript
import { defineFlow, streamText } from '@genkit-ai/core';
import { WebSocket } from 'ws';

const SESSION_ID = process.env.SOCIAL_STREAM_SESSION_ID!;

interface IncomingMessage {
  chatname: string;
  chatmessage: string;
  type: string; // 'twitch', 'youtube', 'custom_api', etc.
  timestamp?: number;
}

let ws: WebSocket;

export function setupSocialStreamListener() {
  ws = new WebSocket(
    `wss://io.socialstream.ninja/join/${SESSION_ID}/4/2`
  );

  ws.on('open', () => {
    console.log('✅ Connected to Social Stream');
  });

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString()) as IncomingMessage;
      await handleIncomingMessage(message);
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  ws.on('close', () => {
    console.log('🔌 Social Stream disconnected, reconnecting...');
    setTimeout(() => setupSocialStreamListener(), 5000);
  });
}

async function handleIncomingMessage(message: IncomingMessage) {
  const { chatname, chatmessage, type } = message;

  console.log(`📩 [${type}] ${chatname}: ${chatmessage}`);

  // Llamar a Genkit AI para generar respuesta
  const response = await generateAIResponse(
    chatmessage,
    chatname,
    type
  );

  // Enviar respuesta
  await sendResponse(response, chatname, type);
}

async function generateAIResponse(
  message: string,
  username: string,
  platform: string
): Promise<string> {
  // Aquí iría la lógica de Genkit para generar respuesta
  // Por ahora, respuesta simple:
  return `Hola ${username}, gracias por tu mensaje: "${message}". ¡Bienvenido a Keruxia!`;
}

async function sendResponse(
  response: string,
  chatname: string,
  platform: string
) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
    return;
  }

  const payload = {
    action: 'sendChat',
    value: response,
  };

  ws.send(JSON.stringify(payload));
  console.log(`✉️ [${platform}] Enviado a ${chatname}`);
}

export const socialStreamAgentFlow = defineFlow(
  {
    name: 'socialStreamAgent',
    inputSchema: { properties: {} },
    outputSchema: { properties: { status: { type: 'string' } } },
  },
  async () => {
    setupSocialStreamListener();
    return { status: 'Agent listening on Social Stream WebSocket' };
  }
);
```

#### 4. Integrar en chat-flow
Archivo: `src/ai/flows/chat-flow.ts`

```typescript
import { socialStreamAgentFlow, setupSocialStreamListener } from './social-stream-agent';

// Iniciar listener en startup
async function initializeChat() {
  if (process.env.SOCIAL_STREAM_SESSION_ID) {
    setupSocialStreamListener();
  }
}

export const chatFlow = defineFlow(
  // ... existing flow config
);
```

---

### Fase 2: Configurar Canales en Social Stream

1. **WhatsApp**
   - Extensions menu → Settings
   - Habilitar "Send chat messages to API server" (Toggle 3)
   - Canal 4 = Entrada

2. **Email**
   - Agregar fuente de email
   - Webhook para forwarding

3. **Otros**
   - Discord, Slack, Telegram (con Toggle)
   - YouTube, Twitch (si necesitas)

---

### Fase 3 (Opcional): Integrar Chatwoot

Si deseas dashboard de soporte:

```bash
# Deploy Chatwoot
docker run -e RAILS_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -p 3000:3000 \
  chatwoot/chatwoot:latest
```

---

## 📊 Comparación Final

### Para IA Agent en tiempo real (Keruxia)
**ELEGIR: Social Stream Ninja** ✅✅✅

```
Social Stream Ninja
├─ WebSocket real-time ✅
├─ Canales numéricos ✅
├─ API ligera ✅
├─ 120+ plataformas ✅
├─ Integración Next.js ✅
└─ Gratis ✅

Chatwoot
├─ REST (no real-time) ❌
├─ Overhead (Rails) ❌
├─ Diseñado para humanos ⚠️
├─ 15 canales ✅
└─ Complejo para IA ❌
```

### Para dashboard de soporte (Equipo)
**ELEGIR: Chatwoot** ✅✅✅

```
Chatwoot
├─ Dashboard profesional ✅
├─ Gestión de agentes ✅
├─ Reportes y analytics ✅
├─ Help Center ✅
└─ Integraciones ✅

Social Stream Ninja
├─ Sin dashboard ❌
├─ No es SaaS completo ❌
├─ Enfoque technical ⚠️
└─ No para equipos ❌
```

---

## 🎯 Recomendación Final

### Para Keruxia: **Social Stream Ninja + (Opcional) Chatwoot**

**Por qué Social Stream Ninja:**
1. ✅ WebSocket bidireccional → Crítico para IA real-time
2. ✅ Canales numéricos → Fácil routing (canal 4 = entrada, canal 2 = salida)
3. ✅ API ligera → Cabe en Next.js sin overhead
4. ✅ 120+ canales → Escalable si el negocio crece
5. ✅ LLM nativo → Integración perfecta con Genkit
6. ✅ Gratis → Servidor centralizado sin costo
7. ✅ Sin login → Setup simple (solo SESSION_ID)

**Implementación:** 
- Agregar `src/ai/flows/social-stream-agent.ts`
- Conectar WebSocket en startup
- Routing de mensajes a flows de Genkit
- ~200 líneas de código

**Timeline:** 2-3 horas de desarrollo

**Costo:** $0 (gratis)

---

## 📚 Referencias

- [Social Stream Ninja GitHub](https://github.com/steveseguin/social_stream)
- [Social Stream API Docs](https://github.com/steveseguin/social_stream/blob/master/api.md)
- [Social Stream Sandbox](https://socialstream.ninja/sampleapi.html)
- [Chatwoot GitHub](https://github.com/chatwoot/chatwoot)
- [Chatwoot Docs](https://www.chatwoot.com/help-center)

---

**Documento generado:** 25 Mar 2026
**Versión:** 1.0
