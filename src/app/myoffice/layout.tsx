
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
import { KeyRound, LayoutGrid, ShoppingBag, Store, Puzzle, Users, FileText, MessageSquare, BookOpen, Beaker, User, Settings, Bot, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    admin: "Admin del Negocio",
    brand: "Marca",
    solutions: "Soluciones",
    plans: "Planes y Servicios",
    questionnaires: "Cuestionarios",
    teamLab: "Team Lab",
    integrations: "Integraciones",
    agent: "Agente IA",
    crm: "CRM",
    instructions: "Instrucciones",
    settings: "Configuración",
    featureFlags: "Feature Flags",
    customerView: "Vista Cliente",
    loggedInAs: "Conectado como:",
    logout: "Cerrar Sesión",
    viewSite: "Ver Sitio",
    redirecting: "Redirigiendo...",
    loadingOffice: "Cargando Oficina...",
    reviewAndSave: "Revisar y Guardar Cambios",
    skipToContent: 'Saltar al contenido principal',
    toggleSidebar: 'Alternar barra lateral',
  },
  en: {
    admin: "Business Admin",
    brand: "Brand",
    solutions: "Solutions",
    plans: "Plans & Services",
    questionnaires: "Questionnaires",
    teamLab: "Team Lab",
    integrations: "Integrations",
    agent: "AI Agent",
    crm: "CRM",
    instructions: "Instructions",
    settings: "Settings",
    featureFlags: "Feature Flags",
    customerView: "Customer View",
    loggedInAs: "Logged in as:",
    logout: "Logout",
    viewSite: "View Site",
    redirecting: "Redirecting...",
    loadingOffice: "Loading Office...",
    reviewAndSave: "Review & Save Changes",
    skipToContent: 'Skip to main content',
    toggleSidebar: 'Toggle sidebar',
  },
  fr: {
    admin: "Admin d'Entreprise",
    brand: "Marque",
    solutions: "Solutions",
    plans: "Forfaits et Services",
    questionnaires: "Questionnaires",
    teamLab: "Labo d'Équipe",
    integrations: "Intégrations",
    agent: "Agent IA",
    crm: "CRM",
    instructions: "Instructions",
    settings: "Paramètres",
    featureFlags: "Feature Flags",
    customerView: "Vue Client",
    loggedInAs: "Connecté en tant que:",
    logout: "Se déconnecter",
    viewSite: "Voir le site",
    redirecting: "Redirection...",
    loadingOffice: "Chargement du bureau...",
    reviewAndSave: "Réviser et Enregistrer",
    skipToContent: 'Aller au contenu principal',
    toggleSidebar: 'Basculer la barre latérale',
  }
};


export default function MyOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { site } = useSite();
  const { auth, logout } = useAuth();
  const { language, getTranslation } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;


  useEffect(() => {
    if (auth.isMounted && auth.user?.role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router]);

  const menuItems = [
    { href: '/myoffice/admin', label: t.admin, icon: <Users />},
    { href: '/myoffice/brand', label: t.brand, icon: <Store /> },
    { href: '/myoffice/services', label: t.solutions, icon: <LayoutGrid /> },
    { href: '/myoffice/products', label: t.plans, icon: <ShoppingBag /> },
    { href: '/myoffice/questionnaires', label: t.questionnaires, icon: <FileText /> },
    { href: '/myoffice/team-lab', label: t.teamLab, icon: <Beaker /> },
    { href: '/myoffice/integrations', label: t.integrations, icon: <Puzzle />},
    { href: '/myoffice/agent', label: t.agent, icon: <Bot /> },
    { href: '/myoffice/crm', label: t.crm, icon: <MessageSquare /> },
    { href: '/myoffice/features', label: t.featureFlags, icon: <Sliders /> },
    { href: '/myoffice/instructions', label: t.instructions, icon: <BookOpen /> },
    { href: '/myoffice/settings', label: t.settings, icon: <Settings /> },
  ];

  if (auth.isMounted && auth.user?.role !== 'admin') {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>{t.redirecting}</p>
      </div>
    );
  }
  
  const siteName = getTranslation(site.brand.name);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        {t.skipToContent}
      </a>
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
          <SidebarTrigger aria-label={t.toggleSidebar} title={t.toggleSidebar} />
           <div>
            <span className="text-sm text-muted-foreground mr-4">{t.loggedInAs} {auth.user?.email}</span>
            <Button onClick={logout} variant="outline" size="sm">{t.logout}</Button>
            <Button asChild variant="outline" size="sm" className="ml-2">
              <Link href="/">{t.viewSite}</Link>
            </Button>
          </div>
        </header>
        <main id="main-content" className="relative flex-1 overflow-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
}
