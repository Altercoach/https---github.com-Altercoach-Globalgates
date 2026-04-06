
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ShoppingCart, KeyRound, User, Shield, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useRole, useIsAdmin, useIsCustomer } from '@/hooks/use-role';
import { LanguageSwitcher } from '@/components/language-switcher';
import { CurrencySwitcher } from '@/components/currency-switcher';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from 'next-themes';
import { useSite } from '@/hooks/use-site';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLabels = {
  es: {
    solutions: 'Soluciones',
    plans: 'Planes y Servicios',
    contact: 'Contacto',
    myOffice: 'Mi Oficina',
    dashboard: 'Panel',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    switchRole: 'Ver como',
    currentRole: 'Rol actual',
    menu: 'Menu',
    brandHome: 'Ir al inicio',
    openCart: 'Abrir carrito',
    toggleTheme: 'Cambiar tema',
    skipToContent: 'Saltar al contenido principal',
    close: 'Cerrar',
  },
  en: {
    solutions: 'Solutions',
    plans: 'Plans & Services',
    contact: 'Contact',
    myOffice: 'My Office',
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    switchRole: 'View as',
    currentRole: 'Current role',
    menu: 'Menu',
    brandHome: 'Go to homepage',
    openCart: 'Open cart',
    toggleTheme: 'Toggle theme',
    skipToContent: 'Skip to main content',
    close: 'Close',
  },
    fr: {
    solutions: 'Solutions',
    plans: 'Forfaits et Services',
    contact: 'Contact',
    myOffice: 'Mon Bureau',
    dashboard: 'Tableau de bord',
    login: 'Connexion',
    logout: 'Se déconnecter',
    switchRole: 'Voir comme',
    currentRole: 'Rôle actuel',
    menu: 'Menu',
    brandHome: 'Aller à l accueil',
    openCart: 'Ouvrir le panier',
    toggleTheme: 'Changer le thème',
    skipToContent: 'Aller au contenu principal',
    close: 'Fermer',
  }
};


export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, getTranslation } = useLanguage();
  const { site } = useSite();
  const pathname = usePathname();
  const router = useRouter();
  const { setIsCartOpen, cart } = useCart();
  const { auth, login, logout } = useAuth();
  const role = useRole();
  const isAdmin = useIsAdmin();
  const isCustomer = useIsCustomer();
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const labels = navLabels[language.code as keyof typeof navLabels] || navLabels.en;
  
  const navItems = useMemo(
    () => [
      { label: labels.solutions, id: 'solutions' },
      { label: labels.plans, id: 'plans' },
      { label: labels.contact, id: 'contact' },
    ],
    [labels]
  );

  const toggleRoleLogin = async () => {
    await login(role === 'admin' ? 'demo@cliente.com' : 'admin@negocio.com', 'Demo123!');
  };

  const navigateToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (pathname !== '/') return;

    const sectionId = window.location.hash.replace('#', '');
    if (sectionId) {
      setActiveSection(sectionId);
    }

    if (sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.25, 0.5, 0.75],
      }
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname, navItems]);
  
  const siteName = getTranslation(site.brand.name);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        {labels.skipToContent}
      </a>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" aria-label={labels.brandHome} className="flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-accent" />
          <span className="font-bold">{siteName}</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={cn(
                  'transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                  activeSection === item.id && 'bg-accent text-accent-foreground hover:bg-accent/90'
                )}
                onClick={() => navigateToSection(item.id)}
              >
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
                <span className="mx-2 text-xs text-muted-foreground">{labels.currentRole}: <b>{role}</b></span>
                <Button size="sm" variant="outline" onClick={toggleRoleLogin}>
                  {labels.switchRole} {role === 'admin' ? 'Cliente' : 'Admin'}
                </Button>
                <Button size="sm" variant="ghost" onClick={logout} className="ml-2">
                  {labels.logout}
                </Button>
              </>
            ) : (
               <Button asChild variant="ghost"><Link href="/login">{labels.login}</Link></Button>
            )}
          </nav>
          
          <div className="flex items-center gap-1">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden focus-visible:ring-accent focus-visible:ring-offset-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{labels.menu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" closeLabel={labels.close} className="w-[85vw] max-w-sm">
                <div className="grid gap-2 py-4">
                  {navItems.map((item) => (
                    <Button
                      key={`mobile-${item.id}`}
                      variant="ghost"
                      aria-current={activeSection === item.id ? 'page' : undefined}
                      className={cn(
                        'h-11 justify-start transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                        activeSection === item.id && 'bg-accent text-accent-foreground hover:bg-accent/90'
                      )}
                      onClick={() => navigateToSection(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                  {!auth.loggedIn && (
                    <Button asChild variant="outline" className="h-11 justify-start">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>{labels.login}</Link>
                    </Button>
                  )}
                  {auth.loggedIn && isAdmin && (
                    <Button asChild variant="ghost" className="h-11 justify-start">
                      <Link href="/myoffice" onClick={() => setMobileMenuOpen(false)}><Shield className="mr-2 h-4 w-4" />{labels.myOffice}</Link>
                    </Button>
                  )}
                  {auth.loggedIn && isCustomer && (
                    <Button asChild variant="ghost" className="h-11 justify-start">
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}><User className="mr-2 h-4 w-4" />{labels.dashboard}</Link>
                    </Button>
                  )}
                  {auth.loggedIn && (
                    <>
                      <span className="px-3 py-2 text-xs text-muted-foreground">{labels.currentRole}: {role}</span>
                      <Button size="sm" variant="outline" onClick={toggleRoleLogin} className="h-11 justify-start">
                        {labels.switchRole} {role === 'admin' ? 'Cliente' : 'Admin'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setMobileMenuOpen(false); logout(); }} className="h-11 justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        {labels.logout}
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <LanguageSwitcher />
            <CurrencySwitcher />
            
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative focus-visible:ring-accent focus-visible:ring-offset-2" aria-label={labels.openCart}>
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                  {cart.length}
                </span>
              )}
              <span className="sr-only">{labels.openCart}</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="focus-visible:ring-accent focus-visible:ring-offset-2" aria-label={labels.toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">{labels.toggleTheme}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
