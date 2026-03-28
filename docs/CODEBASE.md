# Documentación Técnica del Código

## Estructura Principal

- `/src/app/` — Páginas y rutas Next.js (incluye dashboard, settings, productos, servicios, instructivo, legales, API access)
- `/src/components/` — Componentes reutilizables de UI y layout
- `/src/contexts/` — Proveedores de contexto global (auth, site, chat, etc.)
- `/src/hooks/` — Hooks personalizados (useAuth, useSite, useIntegration, etc.)
- `/src/lib/` — Utilidades, tipos, constantes, lógica de negocio
- `/docs/` — Documentación, blueprint, variables de entorno, API

## Convenciones
- **Tipado estricto** con TypeScript en todo el proyecto
- **Componentes funcionales** y hooks para lógica de UI
- **Context Providers** para estado global (auth, site, chat, feature flags)
- **Carpeta `ui/`** para componentes de bajo nivel (botón, input, modal, etc.)
- **Carpeta `sections/`** para secciones de landing reutilizables
- **Carpeta `flows/`** para orquestación de IA y flujos de negocio

## Extensión y Customización
- Para agregar una nueva página: crea un archivo en `/src/app/[nueva-pagina]/page.tsx`
- Para agregar un nuevo feature flag: edita `/src/lib/feature-flags.ts` y actualiza los editores de productos/servicios
- Para agregar un nuevo agente IA: extiende el array de agentes en los editores de bundles

## Seguridad y Buenas Prácticas
- No exponer claves privadas en frontend
- Validar roles y permisos en rutas sensibles
- Usar el panel de ciberseguridad para monitorear vulnerabilidades

## Licencia
- Todo el código propio bajo MIT, dependencias revisadas para compatibilidad libre

## Contacto
- Para dudas técnicas: soporte@globalgate.com
