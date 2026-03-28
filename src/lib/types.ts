
import { z } from 'zod';

import type { ContentPost } from '@/ai/flows/generate-content-schedule-flow';

// Permite asignar agentes IA a cualquier nivel
export type AgentAssignment = {
  id: string; // e.g. 'ai_marketing_assistant', 'crm_bot', etc.
  name: string;
  description?: string;
  enabled: boolean;
};

export type MultilingualString = {
  es: string;
  en: string;
  fr: string;
};

export type ProductFeature = {
  id: string; // e.g., 'brief-marketing', 'business-evaluation', 'agent-training'
  name: string;
  stage: 'onboarding' | 'campaign_start' | 'campaign_end' | 'on_demand';
  enabled: boolean;
  href: string;
};

export type Product = {
  id: string;
  name: MultilingualString;
  type: 'one' | 'sub' | 'info';
  price: number;
  badge: MultilingualString;
  note: MultilingualString;
  description: MultilingualString;
  features: string[]; // Feature flags
  agents?: AgentAssignment[]; // IA agents asignados a este producto
  bundleId?: string; // Si pertenece a un bundle
  longDescription?: MultilingualString;
  whatIncludes?: MultilingualString;
  whatFor?: MultilingualString;
  visible: boolean;
};

export type Service = {
  id: string;
  title: MultilingualString;
  bullets: MultilingualString[];
  features?: string[]; // Feature flags
  agents?: AgentAssignment[];
  bundleId?: string; // Si pertenece a un bundle
  visible: boolean;
};

// Nuevo: Bundle jerárquico
export type Bundle = {
  id: string;
  name: MultilingualString;
  description?: MultilingualString;
  products?: string[]; // IDs de productos incluidos
  services?: string[]; // IDs de servicios incluidos
  features?: string[]; // Feature flags a nivel bundle
  agents?: AgentAssignment[];
  visible: boolean;
};

export type SiteBrand = {
  name: MultilingualString;
  tagline: MultilingualString;
  heroTitle: MultilingualString;
  heroSubtitle: MultilingualString;
  heroImage: string;
  colors: {
    gold: string;
    ink: string;
    bg: string;
    slate: string;
  };
};

export type AgentPersona = {
  firstName: string;
  lastName: string;
  avatar: string; // URL to the avatar image
};

export interface IntegrationStatus {
  connected: boolean;
  connecting: boolean;
  error?: string;
}

export type SiteData = {
  brand: SiteBrand;
  services: Service[];
  products: Product[];
  bundles?: Bundle[];
  agentPersona: AgentPersona;
  // Permite alternar modalidad de visualización: 'hierarchical' | 'modular' | 'mixed'
  viewMode?: 'hierarchical' | 'modular' | 'mixed';
  // Estado de integraciones externas (whatsapp, messenger, etc)
  integrationStatus?: Record<string, IntegrationStatus>;
  // Claves de API de integraciones de datos (Facebook, GA4, etc.)
  integrationsKeys?: Record<string, string>;
  // Email de la cuenta de administrador
  accountEmail?: string;
};

export type CartItem = {
  id: string;
  name: string; // This will be the name in the current language
  price: number;
  type: 'one' | 'sub';
  qty: number;
};

export type AuthRole = 'admin' | 'customer';

export type User = { 
  email: string, 
  role: AuthRole,
  plan?: string, // Added to know which plan the customer has.
}

export type AuthState = {
  loggedIn: boolean;
  user: User | null;
};

export type Language = {
  code: 'es' | 'en' | 'fr';
  name: string;
};

export type Currency = {
  code: string;
  name: string;
  rate: number; // Rate against USD
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'Active' | 'Suspended' | 'Canceled';
  signupDate: Date;
  revenue: number;
};


// Project Workflow Types
export type ProjectPhaseId = 'onboarding' | 'research' | 'planning' | 'execution' | 'closure';
export type ProjectPhaseStatus = 'pending' | 'in_progress' | 'completed' | 'error';

export const projectPhases: { id: ProjectPhaseId, name: string }[] = [
  { id: 'onboarding', name: 'Onboarding y Evaluación' },
  { id: 'research', name: 'Investigación y Estrategia' },
  { id: 'planning', name: 'Planificación y Calendario' },
  { id: 'execution', name: 'Generación y Ejecución' },
  { id: 'closure', name: 'Optimización y Cierre' },
];

export type ProjectPhase = {
  id: ProjectPhaseId;
  name: string;
  status: ProjectPhaseStatus;
  details?: string;
  title?: string;       // alias display label
  description?: string; // alias for details
  progress?: number;    // 0-100
};

export type Project = {
  id: string;
  customerId: string;
  customerName: string;
  currentPhase: ProjectPhaseId;
  phases: ProjectPhase[];
  status: 'Active' | 'Suspended' | 'Canceled';
};


// AI Flow Schemas
export const GenerateImageInputSchema = z.object({
  creativeBrief: z.string().describe('Brief creativo o concepto del post'),
  style: z.string().optional().describe('Estilo visual deseado'),
  // Ratios soportados por Imagen 3 (Google): https://cloud.google.com/vertex-ai/generative-ai/docs/image/generate-images
  aspectRatio: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3']).default('1:1'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('URL de la imagen generada'),
  refinedPrompt: z.string().describe('Prompt refinado usado para generar la imagen'),
  cost: z.number().describe('Costo de la generación en USD'),
  model: z.string().describe('Modelo usado para la generación'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export const GenerateBatchImagesInputSchema = z.object({
  posts: z.array(z.object({
    copyIn: z.string(),
    aspectRatio: z.enum(['1:1', '4:5', '9:16', '16:9']).default('1:1'),
  })),
});
export type GenerateBatchImagesInput = z.infer<typeof GenerateBatchImagesInputSchema>;

export const GenerateBatchImagesOutputSchema = z.object({
  results: z.array(z.object({
    imageUrl: z.string(),
    refinedPrompt: z.string(),
    cost: z.number(),
    success: z.boolean(),
    error: z.string().optional(),
  })),
  totalCost: z.number(),
  successCount: z.number(),
  failureCount: z.number(),
});
export type GenerateBatchImagesOutput = z.infer<typeof GenerateBatchImagesOutputSchema>;

export type { ContentPost };
