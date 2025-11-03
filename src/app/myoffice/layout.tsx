
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { KeyRound, LayoutGrid, ShoppingBag, Store, Puzzle, ShieldCheck, User, FileText, MessageSquare, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    brand: "Marca",
    solutions: "Soluciones",
    plans: "Planes y Servicios",
    questionnaires: "Cuestionarios",
    integrations: "Integraciones y Agente",
    admin: "Admin",
    crm: "CRM",
    customerView: "Vista Cliente",
    loggedInAs: "Conectado como:",
    logout: "Cerrar Sesión",
    viewSite: "Ver Sitio",
    redirecting: "Redirigiendo...",
    loadingOffice: "Cargando Oficina...",
    reviewAndSave: "Revisar y Guardar Cambios"
  },
  en: {
    brand: "Brand",
    solutions: "Solutions",
    plans: "Plans & Services",
    questionnaires: "Questionnaires",
    integrations: "Integrations & Agent",
    admin: "Admin",
    crm: "CRM",
    customerView: "Customer View",
    loggedInAs: "Logged in as:",
    logout: "Logout",
    viewSite: "View Site",
    redirecting: "Redirecting...",
    loadingOffice: "Loading Office...",
    reviewAndSave: "Review & Save Changes"
  },
  fr: {
    brand: "Marque",
    solutions: "Solutions",
    plans: "Forfaits et Services",
    questionnaires: "Questionnaires",
    integrations: "Intégrations et Agent",
    admin: "Admin",
    crm: "CRM",
    customerView: "Vue Client",
    loggedInAs: "Connecté en tant que:",
    logout: "Se déconnecter",
    viewSite: "Voir le site",
    redirecting: "Redirection...",
    loadingOffice: "Chargement du bureau...",
    reviewAndSave: "Réviser et Enregistrer"
  }
};


export default function MyOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { site, hasUnsavedChanges } = useSite();
  const { auth, logout } = useAuth();
  const { language, translatedSite } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;


  useEffect(() => {
    if (auth.user?.role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router]);

  const menuItems = [
    { href: '/myoffice/brand', label: t.brand, icon: <Store /> },
    { href: '/myoffice/services', label: t.solutions, icon: <LayoutGrid /> },
    { href: '/myoffice/products', label: t.plans, icon: <ShoppingBag /> },
    { href: '/myoffice/questionnaires', label: t.questionnaires, icon: <FileText /> },
    { href: '/myoffice/integrations', label: t.integrations, icon: <Puzzle />},
    { href: '/myoffice/admin', label: t.admin, icon: <ShieldCheck />},
    { href: '/myoffice/crm', label: t.crm, icon: <MessageSquare /> },
  ];

  if (auth.user?.role !== 'admin') {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>{t.redirecting}</p>
      </div>
    );
  }
  
  const siteName = translatedSite?.brand?.name || site.brand.name;

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex h-14 items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" asChild>
              <Link href="/">
                <KeyRound />
              </Link>
            </Button>
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">{siteName}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarSeparator />
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard')}
                  tooltip={{ children: t.customerView }}
                >
                  <Link href="/dashboard">
                    <User />
                    <span>{t.customerView}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background p-2">
          <SidebarTrigger />
           <div>
            <span className="text-sm text-muted-foreground mr-4">{t.loggedInAs} {auth.user.email}</span>
            <Button onClick={logout} variant="outline" size="sm">{t.logout}</Button>
            <Button asChild variant="outline" size="sm" className="ml-2">
              <Link href="/">{t.viewSite}</Link>
            </Button>
          </div>
        </header>
        <main className="relative flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
          {hasUnsavedChanges && (
            <div className="fixed bottom-6 right-6 z-50 animate-in fade-in-50 slide-in-from-bottom-5">
              <Button size="lg" asChild>
                <Link href="/myoffice/review-and-save">
                  <Save className="mr-2" />
                  {t.reviewAndSave}
                </Link>
              </Button>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
