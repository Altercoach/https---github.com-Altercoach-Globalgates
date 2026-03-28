# ENVIRONMENT.md

## Variables de entorno requeridas para producción

Copia estas variables en la sección de Environment Variables de Netlify o Firebase Hosting según corresponda. Nunca subas tu .env.local al repositorio.

### Social Stream Ninja
- SOCIAL_STREAM_SESSION_ID
- SOCIAL_STREAM_BASE_URL
- SOCIAL_STREAM_IN_CHANNEL
- SOCIAL_STREAM_OUT_CHANNEL

### Firebase
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_ADMIN_SDK_PATH (solo backend, no exponer en frontend)
- FIREBASE_PROJECT_ID

### Google AI / Genkit
- GOOGLE_GENAI_API_KEY
- NEXT_PUBLIC_GOOGLE_GENAI_API_KEY

### Stripe (si aplica)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY

### Entorno
- NODE_ENV

---

**Notas:**
- No expongas claves privadas en el frontend.
- Revisa que los valores coincidan con los de tu proyecto en Firebase y servicios externos.
- Si usas Netlify, configura estas variables en el panel de "Site settings" > "Environment variables".
- Si usas Firebase Hosting, configura las variables en tu backend o usa secrets según corresponda.
