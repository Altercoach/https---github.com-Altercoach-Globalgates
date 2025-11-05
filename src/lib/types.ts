
import { z } from 'zod';

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
};

export type Product = {
  id: string;
  name: MultilingualString;
  type: 'one' | 'sub' | 'info';
  price: number;
  badge: MultilingualString;
  note: MultilingualString;
  description: MultilingualString;
  features?: ProductFeature[];
  longDescription?: MultilingualString;
  whatIncludes?: MultilingualString;
  whatFor?: MultilingualString;
  visible: boolean;
};

export type Service = {
  id: string;
  title: MultilingualString;
  bullets: MultilingualString[];
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

export type SiteData = {
  brand: SiteBrand;
  services: Service[];
  products: Product[];
  agentPersona: AgentPersona;
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
  role: AuthRole 
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

// AI Flow Schemas
export const GenerateImageInputSchema = z.object({
  creativeBrief: z.string().describe('Brief creativo o concepto del post'),
  style: z.string().optional().describe('Estilo visual deseado'),
  aspectRatio: z.enum(['1:1', '4:5', '9:16', '16:9']).default('1:1'),
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
