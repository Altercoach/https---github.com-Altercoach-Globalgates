

export type ProductFeature = {
  id: string; // e.g., 'brief-marketing', 'business-evaluation', 'agent-training'
  name: string;
  stage: 'onboarding' | 'campaign_start' | 'campaign_end' | 'on_demand';
  enabled: boolean;
};

export type ProductBadge = {
  en: string;
  es: string;
  fr: string;
}

export type Product = {
  id: string;
  name: string;
  type: 'one' | 'sub' | 'info';
  price: number;
  badge: ProductBadge;
  note: string;
  description: string;
  interval?: 'month';
  features?: ProductFeature[];
};

export type Service = {
  id: string;
  title: string;
  bullets: string[];
};

export type SiteBrand = {
  name: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
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
  name: string;
  price: number;
  type: 'one' | 'sub';
  interval: 'month' | null;
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
  code: string;
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
