import type { SiteData, Language, Currency } from '@/lib/types';

export const LS_KEYS = {
  THEME: 'gk_theme',
  SITE: 'gk_site_config',
  CART: 'gk_cart',
  PURCHASED: 'gk_has_purchased',
  AUTH: 'gk_auth_state',
  LANGUAGE: 'gk_language',
  CURRENCY: 'gk_currency',
};

export const DEFAULT_SITE: SiteData = {
  brand: {
    name: 'GlobalGate Agency',
    tagline: 'Marketing estratégico, automatización e IA que abre puertas a tu crecimiento',
    heroTitle: 'Impulsa tu marca con funnels y automatización inteligente',
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
    { id: 'svc-funnel', title: 'Creación del Funnel de Ventas', bullets: [
      'Landing Page optimizada para conversión',
      'Formulario en la nube y base de datos de leads',
      'Chat con respuestas automáticas o botones',
      'Bot asistente de IA (opcional)',
    ]},
    { id: 'svc-branding', title: 'Posicionamiento de Marca (Branding)', bullets: [
      'Diseño de campañas publicitarias', 'Publicaciones programadas', 'Segmentación detallada',
    ]},
    { id: 'svc-content', title: 'Marketing de Contenido', bullets: [
      '15 publicaciones mensuales en Instagram', '15 publicaciones mensuales en Facebook', 'Calendario editorial y copys',
    ]},
    { id: 'svc-loyalty', title: 'Fidelización', bullets: [
      'Contenido de valor (interesante, innovador, gracioso, informativo)', 'Estrategias personalizadas para lealtad',
    ]},
    { id: 'svc-research', title: 'Estudio de Mercado', bullets: [
      'Análisis de cliente ideal y avatar', 'Investigación de insights', 'Sugerencias de imagen corporativa', 'Brief publicitario',
    ]},
  ],
  products: [
    { id: 'p-funnel-setup', name: 'Setup Funnel (Landing + Formularios + Chat)', type: 'one', price: 300, badge: 'Único', note: 'Incluye integración y pruebas. Ideal para arrancar tu embudo.' },
    { id: 'p-bot-ia', name: 'Bot Asistente con IA (configuración inicial)', type: 'one', price: 700, badge: 'IA', note: 'Entrenamiento e integración del bot inteligente.' },
    { id: 'p-research', name: 'Estudio de Mercado Integral', type: 'one', price: 2000, badge: 'Pro', note: 'Gratis si contratas un paquete anual de Marketing.' },
    { id: 's-bot-maint', name: 'Mantenimiento de Bot (mensual)', type: 'sub', interval: 'month', price: 45, badge: 'Mensual', note: 'Monitoreo y ajustes del bot.' },
    { id: 's-content-15', name: 'Marketing de Contenido (15 + 15 / mes)', type: 'sub', interval: 'month', price: 350, badge: 'Contenido', note: 'Sin incluir pauta publicitaria.' },
    { id: 's-brand-8', name: 'Branding (8 publicaciones / mes)', type: 'sub', interval: 'month', price: 200, badge: 'Branding', note: 'Requiere pauta mínima de $250 USD/mes (no incluida).'},
    { id: 'i-brand-4', name: 'Branding (4 publicaciones / mes)', type: 'info', interval: 'month', price: 0, badge: 'Info', note: 'Costo = monto de pauta publicitaria (mínimo $250 USD).' },
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
