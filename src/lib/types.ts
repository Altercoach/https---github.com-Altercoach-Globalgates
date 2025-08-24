
export type Product = {
  id: string;
  name: string;
  type: 'one' | 'sub' | 'info';
  price: number;
  badge: string;
  note: string;
  interval?: 'month';
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

export type AuthState = {
  loggedIn: boolean;
  user: { email: string } | null;
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
