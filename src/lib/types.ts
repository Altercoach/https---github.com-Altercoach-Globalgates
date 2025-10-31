

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

export type SiteData = {
  brand: SiteBrand;
  services: Service[];
  products: Product[];
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
