
import type { Language, Currency, ProductFeature, Customer } from '@/lib/types';

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
