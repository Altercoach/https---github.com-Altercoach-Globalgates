# 🎯 Social Stream + Keruxia: Quick Start Checklist

## ✅ ANTES DE COMPROMETERSE (Commit)

### Paso 1: Obtener Session ID (5 mins)
- [ ] Ir a https://ninja.streamyard.com
- [ ] Crear/seleccionar un Stream
- [ ] Settings → API → Copiar Session ID
- [ ] Guardar Session ID en lugar seguro

### Paso 2: Actualizar .env.local (2 mins)
```bash
# Abrir .env.local y reemplazar:
SOCIAL_STREAM_SESSION_ID=YOUR_SESSION_ID_HERE
```

### Paso 3: Instalar Dependencias (5 mins)
```bash
npm install ws
npm install --save-dev @types/ws
```

### Paso 4: Test de Conexión (5 mins)
```bash
# Iniciar servidor
npm run dev

# En otra terminal
curl http://localhost:9003/api/social-stream/health
```

**Response esperado:**
```json
{
  "status": "healthy",
  "connected": true
}
```

---

## 📦 Archivos Creados/Actualizados

### Nuevos:
- ✅ `src/lib/social-stream-config.ts` - Configuración centralizada
- ✅ `.env.local` - Variables de entorno
- ✅ `SOCIAL_STREAM_INTEGRATION.md` - Documentación completa

### Actualizados:
- ✅ `src/ai/flows/social-stream-agent.ts` - Agente mejorado con Firestore
- ✅ `src/app/api/social-stream/route.ts` - API endpoints
- ✅ `package.json` - Nuevas dependencias (ws)

---

## 🔄 Cambios Principales

### 1. Configuración Centralizada
```typescript
// Antes: Esparcido en varios archivos
// Ahora: Todo en src/lib/social-stream-config.ts
import { socialStreamConfig } from '@/lib/social-stream-config';
```

### 2. WebSocket Robusto
```typescript
// Reconexión automática con backoff exponencial
// Buffering de mensajes durante desconexiones
// Heartbeat para mantener conexión viva
```

### 3. Integración Firestore
```typescript
// Guardar automáticamente:
// - Mensajes entrantes
// - Respuestas generadas
// - Metadata (channel, timestamp, etc.)
```

### 4. API Endpoints Completos
```
POST   /api/social-stream/init        - Inicializar
POST   /api/social-stream/send        - Enviar mensaje
POST   /api/social-stream/block       - Bloquear usuario
POST   /api/social-stream/command     - Comando raw
GET    /api/social-stream/status      - Estado
GET    /api/social-stream/messages    - Historial
GET    /api/social-stream/health      - Health check
DELETE /api/social-stream/close       - Cerrar conexión
```

---

## 🗂️ Estructura de Directorios

```
src/
├── lib/
│   └── social-stream-config.ts      (NEW)
├── ai/flows/
│   └── social-stream-agent.ts       (UPDATED)
└── app/api/social-stream/
    └── route.ts                      (UPDATED)

.env.local                            (NEW)
SOCIAL_STREAM_INTEGRATION.md          (NEW)
SOCIAL_STREAM_QUICK_START.md          (THIS FILE)
```

---

## 🚀 Próximos Pasos Después del Commit

### Inmediatamente:
1. [ ] Obtener Session ID de Social Stream
2. [ ] Actualizar `.env.local`
3. [ ] Test: `npm run dev` + `curl health`
4. [ ] Conectar WhatsApp en Social Stream Dashboard

### Esta Semana:
5. [ ] Entrenar agente IA con ejemplos
6. [ ] Conectar Email + Telegram
7. [ ] Configurar Firestore para persistencia
8. [ ] Dashboard de monitoreo

### Próximas 2 Semanas:
9. [ ] Integrar con Stripe (pagos)
10. [ ] Setup Firebase Auth (login real)
11. [ ] Moderación automática
12. [ ] Analytics & reportes

---

## 📝 Git Commit Message

```bash
git add .
git commit -m "feat: integrate Social Stream Ninja for multi-channel AI agent

- Add social-stream-config.ts for centralized configuration
- Implement robust WebSocket client with auto-reconnection
- Add Firestore persistence for message logging
- Create comprehensive API endpoints (/init, /send, /block, /command, etc.)
- Add environment variables template (.env.local)
- Add detailed documentation (SOCIAL_STREAM_INTEGRATION.md)
- Update social-stream-agent.ts with Genkit + Firestore integration
- Support 120+ channels: WhatsApp, Email, Telegram, Discord, Slack, LinkedIn, Twitter, etc.

Features:
- Real-time WebSocket communication
- Automatic message buffering during disconnections
- Exponential backoff reconnection strategy
- AI-powered responses via Genkit + Gemini 1.5 Pro
- Message history in Firestore
- Health checks and comprehensive error handling

Configuration:
- Set SOCIAL_STREAM_SESSION_ID in .env.local
- Initialize agent: POST /api/social-stream/init
- Send messages: POST /api/social-stream/send
- Monitor: GET /api/social-stream/health

Closes #keruxia-multichannel"

git push origin main
```

---

## ⚡ Verificación Final

Antes de comentar que está listo:

```bash
# 1. Build sin errores
npm run build

# 2. Typecheck
npm run typecheck

# 3. Test endpoints
curl -X GET http://localhost:9003/api/social-stream/health

# 4. Verificar archivos nuevos
ls -la src/lib/social-stream-config.ts
ls -la .env.local
ls -la SOCIAL_STREAM_INTEGRATION.md
```

---

## 💡 Tips

- **Session ID expira?**: Crear nuevo en Social Stream Dashboard
- **WebSocket no conecta?**: Verificar `SOCIAL_STREAM_SESSION_ID` en `.env.local`
- **Mensajes no persisten?**: Asegurar que Firebase está configurado
- **AI no responde?**: Verificar `GOOGLE_GENAI_API_KEY` en `.env.local`

---

**¡Listo para hacer commit!** 🚀
