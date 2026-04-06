# Goldek Key International SaaS

Plataforma SaaS para gestión de marketing, IA y automatización.

## Índice
- [Guía de Usuario](src/app/instructions/page.tsx)
- [Guía de Deploy](docs/blueprint.md)
- [Variables de Entorno](docs/ENVIRONMENT.md)
- [Referencia API](API_REFERENCE.md)
- [Acceso a la API](src/app/api-access/page.tsx)
- [Política de Privacidad](src/app/privacy/page.tsx)
- [Términos y Condiciones](src/app/terms/page.tsx)
- [Aviso Legal](src/app/legal/page.tsx)
- [Documentación Técnica](docs/CODEBASE.md)
- [Changelog](docs/CHANGELOG.md)

## Firebase y Firestore
- Configuración versionable: [firebase.json](firebase.json), [firestore.rules](firestore.rules), [firestore.indexes.json](firestore.indexes.json)
- Credenciales locales: usa `FIREBASE_ADMIN_SDK_PATH=./credentials.json` en `.env.local`
- Las órdenes del checkout se sincronizan por API segura en [src/app/api/orders/route.ts](src/app/api/orders/route.ts) usando Firebase Admin SDK
- Si despliegas con service account JSON, la cuenta necesita al menos permiso `serviceusage.services.use` (por ejemplo `roles/serviceusage.serviceUsageConsumer`) además de los permisos de Firestore necesarios para reglas/índices.
- Despliegue de reglas e índices:
	- `npm install -g firebase-tools`
	- `firebase login`
	- `firebase use globalgate-agency`
	- `firebase deploy --only firestore:rules,firestore:indexes`
	- Alternativa desde este repo: `npm run deploy:firestore`

## Licencia
MIT — ver [LICENSE](LICENSE)

## Contacto
soporte@globalgate.com
