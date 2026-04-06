
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, LogOut, Settings, User, Menu, Home, BookOpen, MessageSquare, Bot, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    title: "Panel de Cliente",
    home: "Página Principal",
    dashboard: "Dashboard",
    crm: "CRM (Supervisión)",
    agent: "Agente IA",
    payments: "Pagos y Ventas",
    settings: "Configuración",
    instructions: "Instrucciones",
    logout: "Cerrar Sesión",
    redirecting: "Redirigiendo...",
    backToSite: "Volver al Sitio",
    menu: 'Menu',
    skipToContent: 'Saltar al contenido principal',
    close: 'Cerrar',
  },
  en: {
    title: "Customer Dashboard",
    home: "Main Page",
    dashboard: "Dashboard",
    crm: "CRM (Supervision)",
    agent: "AI Agent",
    payments: "Payments & Sales",
    settings: "Settings",
    instructions: "Instructions",
    logout: "Logout",
    redirecting: "Redirecting...",
    backToSite: "Back to Site",
    menu: 'Menu',
    skipToContent: 'Skip to main content',
    close: 'Close',
  },
  fr: {
    title: "Tableau de Bord Client",
    home: "Page d'accueil",
    dashboard: "Tableau de bord",
    crm: "CRM (Supervision)",
    agent: "Agent IA",
    payments: "Paiements et Ventes",
    settings: "Paramètres",
    instructions: "Instructions",
    logout: "Se déconnecter",
    redirecting: "Redirection...",
    backToSite: "Retour au site",
    menu: 'Menu',
    skipToContent: 'Aller au contenu principal',
    close: 'Fermer',
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { auth, logout } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Only redirect if auth is loaded and user is not a customer.
    if (auth.isMounted && !auth.user) {
        router.push('/login');
    }
  }, [auth.isMounted, auth.user, router]);

  const navItems = [
    { href: '/', label: t.home, icon: Home },
    { href: '/dashboard', label: t.dashboard, icon: BarChart },
    { href: '/dashboard/crm', label: t.crm, icon: MessageSquare },
    { href: '/dashboard/agent', label: t.agent, icon: Bot },
    { href: '/dashboard/payments', label: t.payments, icon: CreditCard },
    { href: '/dashboard/settings', label: t.settings, icon: Settings },
    { href: '/instructions', label: t.instructions, icon: BookOpen },
  ];

  if (!auth.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t.redirecting}</p>
      </div>
    );
  }
  
  const DesktopNav = () => (
    <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <User className="h-6 w-6" />
                    <span>{t.title}</span>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
             <div className="mt-auto p-4">
                <Button size="sm" className="w-full" onClick={logout}>
                   <LogOut className="mr-2 h-4 w-4" />
                    {t.logout}
                </Button>
            </div>
        </div>
    </div>
  );

    const MobileNav = () => (
     <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
            <span className="sr-only">{t.menu}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" closeLabel={t.close} className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                    >
                        <User className="h-6 w-6" />
                        <span>{t.title}</span>
                    </Link>
                    {navItems.map(item => (
                         <Link
                            key={item.href}
                            href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                 <div className="mt-auto">
                    <Button size="sm" className="w-full" onClick={() => { setMobileMenuOpen(false); logout(); }}>
                       <LogOut className="mr-2 h-4 w-4" />
                        {t.logout}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <span className="font-semibold">{navItems.find(item => item.href === pathname)?.label || 'Dashboard'}</span>
        </div>
         <Button variant="outline" size="sm" asChild>
            <Link href="/">{t.backToSite}</Link>
        </Button>
    </header>
  );


  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        {t.skipToContent}
      </a>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
       <DesktopNav />
        <div className="flex flex-col">
            <MobileNav />
            <main id="main-content" className="flex-1 bg-muted/20 p-4 sm:px-6 sm:py-6">
                {children}
            </main>
        </div>
    </div>
    </>
  );
}
    