
import type { SiteData, Language, Currency, ProductFeature, Customer, ProductBadge } from '@/lib/types';

export const LS_KEYS = {
  THEME: 'gk_theme',
  SITE: 'gk_site_config',
  CART: 'gk_cart',
  PURCHASED: 'gk_has_purchased',
  AUTH: 'gk_auth_state',
  LANGUAGE: 'gk_language',
  CURRENCY: 'gk_currency',
};

export const defaultFeatures: ProductFeature[] = [
  { id: 'business-evaluation', name: 'Business Evaluation (Doctor RX)', stage: 'onboarding', enabled: false },
  { id: 'brief-marketing', name: 'Professional Marketing Brief', stage: 'onboarding', enabled: false },
  { id: 'agent-training', name: 'AI Agent Training', stage: 'onboarding', enabled: false },
  { id: 'satisfaction-survey', name: 'Satisfaction Survey', stage: 'campaign_end', enabled: false },
];

const oneTimeBadge: ProductBadge = { en: 'One-time', es: 'Pago Único', fr: 'Unique' };
const aiBadge: ProductBadge = { en: 'AI', es: 'IA', fr: 'IA' };
const proBadge: ProductBadge = { en: 'Pro', es: 'Pro', fr: 'Pro' };
const monthlyBadge: ProductBadge = { en: 'Monthly', es: 'Mensual', fr: 'Mensuel' };
const contentBadge: ProductBadge = { en: 'Content', es: 'Contenido', fr: 'Contenu' };
const brandingBadge: ProductBadge = { en: 'Branding', es: 'Marca', fr: 'Marque' };
const infoBadge: ProductBadge = { en: 'Info', es: 'Info', fr: 'Info' };


export const DEFAULT_SITE: SiteData = {
  brand: {
    name: 'GlobalGate Agency',
    tagline: 'Strategic marketing, automation, and AI that open doors to your growth',
    heroTitle: 'Boost your brand with smart funnels and automation',
    heroSubtitle: 'Branding, content, and sales funnels integrated to attract, convert, and retain.',
    heroImage: '',
    colors: {
      gold: '#d4af37',
      ink: '#0f172a',
      bg: '#ffffff',
      slate: '#111315',
    },
  },
  services: [
    { id: 'svc-funnel', title: 'Sales Funnel Creation', bullets: [
      'Landing Page optimized for conversion',
      'Cloud-based form and lead database',
      'AI Agent with automatic responses or buttons',
      'CRM Integration',
    ]},
    { id: 'svc-branding', title: 'Brand Positioning', bullets: [
      'Ad campaign design', 'Scheduled posts', 'Detailed audience segmentation',
    ]},
    { id: 'svc-content', title: 'Content Marketing', bullets: [
      '15 monthly Instagram posts', '15 monthly Facebook posts', 'Editorial calendar and persuasive copy',
    ]},
    { id: 'svc-loyalty', title: 'Customer Loyalty', bullets: [
      'Valuable content (interesting, innovative, fun, informative)', 'Personalized loyalty strategies',
    ]},
    { id: 'svc-research', title: 'Market Research', bullets: [
      'Ideal customer profile (avatar) analysis', 'Key insight research', 'Corporate image suggestions', 'Advertising brief document',
    ]},
  ],
  products: [
    { id: 'p-funnel-setup', name: 'Funnel Setup (Landing + Forms + AI Agent)', type: 'one', price: 300, badge: oneTimeBadge, note: 'Includes integration and testing. Ideal for starting your sales funnel.', description: 'This one-time payment package sets up your initial sales funnel. It includes an optimized landing page, cloud-based forms to capture leads, and a basic AI Agent to interact with your visitors.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-ai-agent', name: 'AI Agent (Initial Setup)', type: 'one', price: 700, badge: aiBadge, note: 'Training and integration of the smart agent.', description: 'We implement an AI Agent trained with your information to answer questions, qualify prospects, and schedule appointments. A single payment for the complete setup.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-research', name: 'Comprehensive Market Research', type: 'one', price: 2000, badge: proBadge, note: 'Free when you hire an annual Marketing plan.', description: 'In-depth analysis of your competition, ideal customer, and market. We provide a complete advertising brief and corporate image suggestions. This service is free when hiring an annual marketing plan.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-ai-agent-maint', name: 'AI Agent Maintenance (monthly)', type: 'sub', interval: 'month', price: 45, badge: monthlyBadge, note: 'Agent monitoring and adjustments.', description: 'We ensure the optimal performance of your AI Agent with constant monitoring, adjustments, and optimizations. This is a monthly subscription plan.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-content-15', name: 'Content Marketing (15 + 15 / month)', type: 'sub', interval: 'month', price: 350, badge: contentBadge, note: 'Advertising budget (ad cost) not included.', description: 'Creation of 15 Instagram posts and 15 Facebook posts each month, including editorial calendar, persuasive copy, and designs. Does not include the cost of the advertising budget (ads).', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-brand-8', name: 'Branding (8 posts / month)', type: 'sub', interval: 'month', price: 200, badge: brandingBadge, note: 'Requires a minimum ad spend of $250 USD/month (not included).', description: 'We develop 8 brand posts per month to position your company. This plan requires a minimum investment of $250 USD in advertising spend, which is not included in the price.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'i-brand-4', name: 'Branding (4 posts / month)', type: 'info', interval: 'month', price: 0, badge: infoBadge, note: 'Cost = ad spend amount (minimum $250 USD).', description: 'This is an informational plan. We create 4 branding posts per month, and the service cost equals your investment in advertising, with a minimum of $250 USD. Contact us to activate it.', features: JSON.parse(JSON.stringify(defaultFeatures)) },
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

export const initialCustomers: Customer[] = [
  { id: 'cus_001', name: 'John Doe', email: 'john.doe@example.com', plan: 'Marketing de Contenido', status: 'Active', signupDate: new Date('2023-10-15'), revenue: 350 },
  { id: 'cus_002', name: 'Jane Smith', email: 'demo@cliente.com', plan: 'Setup Funnel + Contenido', status: 'Active', signupDate: new Date('2023-11-01'), revenue: 650 },
  { id: 'cus_003', name: 'Mike Johnson', email: 'mike.j@example.com', plan: 'Branding (8 pub)', status: 'Suspended', signupDate: new Date('2023-09-20'), revenue: 200 },
  { id: 'cus_004', name: 'Emily Brown', email: 'emily.b@example.com', plan: 'Marketing de Contenido', status: 'Active', signupDate: new Date('2023-12-05'), revenue: 350 },
  { id: 'cus_005', name: 'Chris Wilson', email: 'chris.w@example.com', plan: 'Agente de IA', status: 'Canceled', signupDate: new Date('2023-08-10'), revenue: 700 },
  { id: 'cus_006', name: 'Sara Miller', email: 'sara.m@example.com', plan: 'Branding (8 pub)', status: 'Active', signupDate: new Date('2024-01-02'), revenue: 200 },
];
