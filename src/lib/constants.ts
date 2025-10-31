

import type { SiteData, Language, Currency, ProductFeature } from '@/lib/types';

export const LS_KEYS = {
  THEME: 'gk_theme',
  SITE: 'gk_site_config',
  CART: 'gk_cart',
  PURCHASED: 'gk_has_purchased',
  AUTH: 'gk_auth_state',
  LANGUAGE: 'gk_language',
  CURRENCY: 'gk_currency',
};

const defaultFeatures: ProductFeature[] = [
  { id: 'business-evaluation', name: 'Evaluación de Negocio (Doctor RX)', stage: 'onboarding', enabled: false },
  { id: 'brief-marketing', name: 'Brief de Marketing Profesional', stage: 'onboarding', enabled: false },
  { id: 'agent-training', name: 'Entrenamiento de Agente de IA', stage: 'onboarding', enabled: false },
  { id: 'satisfaction-survey', name: 'Encuesta de Satisfacción', stage: 'campaign_end', enabled: false },
];

export const DEFAULT_SITE: SiteData = {
  brand: {
    name: 'GlobalGate Agency',
    tagline: 'Marketing estratégico, automatización e IA que abre puertas a tu crecimiento',
    heroTitle: 'Impulsa tu marca con funnels (embudos de venta) y automatización inteligente',
    heroSubtitle: 'Branding, contenido y embudos de ventas integrados para atraer, convertir y fidelizar.',
    heroImage: '',
    colors: {
      gold: '#d4af37',
      ink: '#0f172a',
      bg: '#ffffff',
      slate: '#111315',
    },
  },
  services: [
    { id: 'svc-funnel', title: 'Creación del Funnel (Embudo de Ventas)', bullets: [
      'Landing Page (página de destino) optimizada para conversión',
      'Formulario en la nube y base de datos de clientes potenciales (leads)',
      'Agente de IA con respuestas automáticas o botones',
      'Integración con CRM',
    ]},
    { id: 'svc-branding', title: 'Posicionamiento de Marca (Branding)', bullets: [
      'Diseño de campañas publicitarias', 'Publicaciones programadas', 'Segmentación detallada de público',
    ]},
    { id: 'svc-content', title: 'Marketing de Contenido', bullets: [
      '15 publicaciones mensuales en Instagram', '15 publicaciones mensuales en Facebook', 'Calendario editorial y textos persuasivos (copys)',
    ]},
    { id: 'svc-loyalty', title: 'Fidelización', bullets: [
      'Contenido de valor (interesante, innovador, gracioso, informativo)', 'Estrategias personalizadas para lealtad',
    ]},
    { id: 'svc-research', title: 'Estudio de Mercado', bullets: [
      'Análisis de cliente ideal y su perfil (avatar)', 'Investigación de ideas clave (insights)', 'Sugerencias de imagen corporativa', 'Documento guía (brief) publicitario',
    ]},
  ],
  products: [
    { id: 'p-funnel-setup', name: 'Setup Funnel (Landing + Formularios + Agente IA)', type: 'one', price: 300, badge: 'Único', note: 'Incluye integración y pruebas. Ideal para arrancar tu embudo de ventas.', description: 'Este paquete de pago único configura tu embudo de ventas inicial. Incluye una página de destino (landing page) optimizada, formularios en la nube para capturar clientes potenciales (leads) y un Agente de IA básico para interactuar con tus visitantes.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-ai-agent', name: 'Agente de IA (configuración inicial)', type: 'one', price: 700, badge: 'IA', note: 'Entrenamiento e integración del agente inteligente.', description: 'Implementamos un Agente de Inteligencia Artificial entrenado con tu información para responder preguntas, calificar prospectos y agendar citas. Un único pago para la configuración completa.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-research', name: 'Estudio de Mercado Integral', type: 'one', price: 2000, badge: 'Pro', note: 'Gratis si contratas un paquete anual de Marketing.', description: 'Análisis profundo de tu competencia, cliente ideal y mercado. Te entregamos un documento guía (brief) publicitario completo y sugerencias de imagen corporativa. Este servicio es gratuito al contratar un plan de marketing anual.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-ai-agent-maint', name: 'Mantenimiento de Agente de IA (mensual)', type: 'sub', interval: 'month', price: 45, badge: 'Mensual', note: 'Monitoreo y ajustes del agente.', description: 'Aseguramos el óptimo funcionamiento de tu Agente de IA con monitoreo constante, ajustes y optimizaciones. Este es un plan de suscripción mensual.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-content-15', name: 'Marketing de Contenido (15 + 15 / mes)', type: 'sub', interval: 'month', price: 350, badge: 'Contenido', note: 'Sin incluir pauta publicitaria (costo de anuncios).', description: 'Creación de 15 publicaciones para Instagram y 15 para Facebook cada mes, incluyendo calendario editorial, textos persuasivos (copys) y diseños. No incluye el costo de la pauta publicitaria (anuncios).', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-brand-8', name: 'Branding (8 publicaciones / mes)', type: 'sub', interval: 'month', price: 200, badge: 'Branding', note: 'Requiere pauta mínima de $250 USD/mes (no incluida).', description: 'Desarrollamos 8 publicaciones de marca al mes para posicionar tu empresa. Este plan requiere una inversión mínima de $250 USD en pauta publicitaria (costo de anuncios), la cual no está incluida en el precio.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'i-brand-4', name: 'Branding (4 publicaciones / mes)', type: 'info', interval: 'month', price: 0, badge: 'Info', note: 'Costo = monto de pauta publicitaria (mínimo $250 USD).', description: 'Este es un plan informativo. Creamos 4 publicaciones de branding al mes y el costo del servicio es igual a tu inversión en pauta publicitaria (costo de anuncios), con un mínimo de $250 USD. Contáctanos para activarlo.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
  ],
};

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', rate: 1 },
  { code: 'EUR', name: 'Euro', rate: 0.93 },
  { code: 'MXN', name: 'Mexican Peso', rate: 18.05 },
];
