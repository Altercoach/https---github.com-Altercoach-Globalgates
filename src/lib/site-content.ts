
import type { SiteData, ProductBadge } from '@/lib/types';
import { defaultFeatures } from '@/lib/constants';

const oneTimeBadge: ProductBadge = { en: 'One-time', es: 'Pago Único', fr: 'Unique' };
const aiBadge: ProductBadge = { en: 'AI', es: 'IA', fr: 'IA' };
const proBadge: ProductBadge = { en: 'Pro', es: 'Pro', fr: 'Pro' };
const monthlyBadge: ProductBadge = { en: 'Monthly', es: 'Mensual', fr: 'Mensuel' };
const contentBadge: ProductBadge = { en: 'Content', es: 'Contenido', fr: 'Contenu' };
const brandingBadge: ProductBadge = { en: 'Branding', es: 'Marca', fr: 'Marque' };
const infoBadge: ProductBadge = { en: 'Info', es: 'Info', fr: 'Info' };

export const DEFAULT_SITE_CONTENT: SiteData = {
  brand: {
    name: 'Golden Key',
    tagline: 'Marketing Estratégico, Automatización e IA que abren las puertas a tu crecimiento',
    heroTitle: 'Aumenta tus ventas, posiciona tu marca y estimula la preferencia por tus productos o servicios.',
    heroSubtitle: 'Contrata ahora mismo campañas de marketing, embudos de ventas, automatizaciones y agentes de inteligencia a tu servicio 24/7.',
    heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: {
      gold: '#d4af37',
      ink: '#0f172a',
      bg: '#ffffff',
      slate: '#111315',
    },
  },
  services: [
    { id: 'svc-funnel', title: 'Creación de Embudo de Ventas', bullets: [
      'Landing Page optimizada para conversión',
      'Formulario y base de datos de leads en la nube',
      'Agente de IA con respuestas automáticas o botones',
      'Integración con CRM',
    ]},
    { id: 'svc-branding', title: 'Posicionamiento de Marca', bullets: [
      'Diseño de campañas de anuncios', 'Publicaciones programadas', 'Segmentación detallada de audiencia',
    ]},
    { id: 'svc-content', title: 'Marketing de Contenidos', bullets: [
      '15 publicaciones mensuales en Instagram', '15 publicaciones mensuales en Facebook', 'Calendario editorial y copy persuasivo',
    ]},
    { id: 'svc-loyalty', title: 'Fidelización de Clientes', bullets: [
      'Contenido de valor (interesante, innovador, divertido, informativo)', 'Estrategias de lealtad personalizadas',
    ]},
    { id: 'svc-research', title: 'Investigación de Mercado', bullets: [
      'Análisis de perfil de cliente ideal (avatar)', 'Investigación de insights clave', 'Sugerencias de imagen corporativa', 'Documento de brief publicitario',
    ]},
  ],
  products: [
    { id: 'p-funnel-setup', name: 'Setup Funnel (Landing + Formularios + Agente IA)', type: 'one', price: 300, badge: oneTimeBadge, note: 'Incluye integración y pruebas. Ideal para iniciar tu embudo de ventas.', description: 'Este paquete de pago único configura tu embudo de ventas inicial. Incluye una landing page optimizada, formularios en la nube para capturar leads y un Agente de IA básico para interactuar con tus visitantes.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-ai-agent', name: 'Agente de IA (Setup Inicial)', type: 'one', price: 700, badge: aiBadge, note: 'Entrenamiento e integración del agente inteligente.', description: 'Implementamos un Agente de IA entrenado con tu información para responder preguntas, calificar prospectos y agendar citas. Un pago único por la configuración completa.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-research', name: 'Investigación de Mercado Completa', type: 'one', price: 2000, badge: proBadge, note: 'Gratis al contratar un plan anual de Marketing.', description: 'Análisis profundo de tu competencia, cliente ideal y mercado. Entregamos un brief publicitario completo y sugerencias de imagen corporativa. Este servicio es gratuito al contratar un plan de marketing anual.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-ai-agent-maint', name: 'Mantenimiento Agente IA (mensual)', type: 'sub', interval: 'month', price: 45, badge: monthlyBadge, note: 'Monitoreo y ajustes del agente.', description: 'Aseguramos el rendimiento óptimo de tu Agente de IA con monitoreo constante, ajustes y optimizaciones. Este es un plan de suscripción mensual.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-content-15', name: 'Marketing de Contenido (15 + 15 / mes)', type: 'sub', interval: 'month', price: 350, badge: contentBadge, note: 'Pauta publicitaria (costo de anuncios) no incluida.', description: 'Creación de 15 publicaciones para Instagram y 15 para Facebook cada mes, incluye calendario editorial, copy persuasivo y diseños. No incluye el costo de la pauta publicitaria (anuncios).', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-brand-8', name: 'Branding (8 pub / mes)', type: 'sub', interval: 'month', price: 200, badge: brandingBadge, note: 'Requiere pauta mín. de $250 USD/mes (no incluida).', description: 'Desarrollamos 8 publicaciones de marca al mes para posicionar tu empresa. Este plan requiere una inversión mínima de $250 USD en pauta publicitaria, no incluida en el precio.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'i-brand-4', name: 'Branding (4 pub / mes)', type: 'info', interval: 'month', price: 0, badge: infoBadge, note: 'Costo = monto de la pauta (mín. $250 USD).', description: 'Este es un plan informativo. Creamos 4 publicaciones de marca al mes y el costo del servicio equivale a tu inversión en pauta publicitaria, con un mínimo de $250 USD. Contáctanos para activarlo.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
  ],
};
