
'use client';

import Link from 'next/link';
import { Moon, Sun, ShoppingCart, KeyRound, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useRole, useIsAdmin, useIsCustomer } from '@/hooks/use-role';
import { LanguageSwitcher } from '@/components/language-switcher';
import { CurrencySwitcher } from '@/components/currency-switcher';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from 'next-themes';
import { useSite } from '@/hooks/use-site';

const navLabels = {
  es: {
    solutions: 'Soluciones',
    plans: 'Planes y Servicios',
    contact: 'Contacto',
    myOffice: 'Mi Oficina',
    dashboard: 'Panel',
    login: 'Iniciar Sesión'
  },
  en: {
    solutions: 'Solutions',
    plans: 'Plans & Services',
    contact: 'Contact',
    myOffice: 'My Office',
    dashboard: 'Dashboard',
    login: 'Login'
  },
    fr: {
    solutions: 'Solutions',
    plans: 'Forfaits et Services',
    contact: 'Contact',
    myOffice: 'Mon Bureau',
    dashboard: 'Tableau de bord',
    login: 'Connexion'
  }
};


export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, getTranslation } = useLanguage();
  const { site } = useSite();
  const { setIsCartOpen, cart } = useCart();
  const { auth, login, logout } = useAuth();
  const role = useRole();
  const isAdmin = useIsAdmin();
  const isCustomer = useIsCustomer();
  
  const labels = navLabels[language.code as keyof typeof navLabels] || navLabels.en;
  
  const navItems = [
    { label: labels.solutions, id: 'solutions' },
    { label: labels.plans, id: 'plans' },
    { label: labels.contact, id: 'contact' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const siteName = getTranslation(site.brand.name);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-accent" />
          <span className="font-bold">{siteName}</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-1 md:flex">
            {navItems.map((item) => (
              <Button key={item.id} variant="ghost" onClick={() => scrollTo(item.id)}>
                {item.label}
              </Button>
            ))}
            {auth.loggedIn ? (
              <>
                {isAdmin && (
                  <Button asChild variant="ghost"><Link href="/myoffice"><Shield/> {labels.myOffice}</Link></Button>
                )}
                {isCustomer && (
                   <Button asChild variant="ghost"><Link href="/dashboard"><User/> {labels.dashboard}</Link></Button>
                )}
                <span className="mx-2 text-xs text-muted-foreground">Rol actual: <b>{role}</b></span>
                <Button size="sm" variant="outline" onClick={async () => { await login(role === 'admin' ? 'demo@cliente.com' : 'admin@negocio.com', 'Demo123!'); }}>
                  Ver como {role === 'admin' ? 'Cliente' : 'Admin'}
                </Button>
                <Button size="sm" variant="ghost" onClick={logout} className="ml-2">
                  Logout
                </Button>
              </>
            ) : (
               <Button asChild variant="ghost"><Link href="/login">{labels.login}</Link></Button>
            )}
          </nav>
          
          <div className="flex items-center">
            <LanguageSwitcher />
            <CurrencySwitcher />
            
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                  {cart.length}
                </span>
              )}
              <span className="sr-only">Open Cart</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
