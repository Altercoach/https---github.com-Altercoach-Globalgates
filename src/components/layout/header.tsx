
'use client';

import Link from 'next/link';
import { Moon, Sun, ShoppingCart, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { LanguageSwitcher } from '@/components/language-switcher';
import { CurrencySwitcher } from '@/components/currency-switcher';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { site } = useSite();
  const { translatedSite } = useLanguage();
  const { setIsCartOpen, hasPurchased, cart } = useCart();
  const { auth } = useAuth();
  
  const navItems = [
    { label: 'Servicios', id: 'services' },
    { label: 'Planes', id: 'plans' },
    { label: 'Contacto', id: 'contact' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const siteName = translatedSite?.brand?.name || site.brand.name;

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
              <Button asChild variant="ghost"><Link href="/dashboard">Dashboard</Link></Button>
            ) : (
               <>
                <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
                <Button asChild variant="ghost" disabled={!hasPurchased}>
                  <Link href="/signup" aria-disabled={!hasPurchased} tabIndex={!hasPurchased ? -1 : undefined}>Crear Cuenta</Link>
                </Button>
               </>
            )}
             <Button asChild variant="ghost"><Link href="/editor">Editor</Link></Button>
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
              <span className="sr-only">Abrir Carrito</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
