
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
import { KeyRound, LayoutGrid, ShoppingBag, Store, Puzzle, ShieldCheck, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    brand: "Marca",
    services: "Servicios",
    products: "Productos",
    questionnaires: "Cuestionarios",
    integrations: "Integraciones",
    admin: "Admin",
    customerView: "Vista Cliente",
    loggedInAs: "Conectado como:",
    logout: "Cerrar Sesión",
    viewSite: "Ver Sitio",
    redirecting: "Redirigiendo...",
    loadingOffice: "Cargando Oficina..."
  },
  en: {
    brand: "Brand",
    services: "Services",
    products: "Products",
    questionnaires: "Questionnaires",
    integrations: "Integrations",
    admin: "Admin",
    customerView: "Customer View",
    loggedInAs: "Logged in as:",
    logout: "Logout",
    viewSite: "View Site",
    redirecting: "Redirecting...",
    loadingOffice: "Loading Office..."
  },
  fr: {
    brand: "Marque",
    services: "Services",
    products: "Produits",
    questionnaires: "Questionnaires",
    integrations: "Intégrations",
    admin: "Admin",
    customerView: "Vue Client",
    loggedInAs: "Connecté en tant que:",
    logout: "Se déconnecter",
    viewSite: "Voir le site",
    redirecting: "Redirection...",
    loadingOffice: "Chargement du bureau..."
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
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;


  useEffect(() => {
    if (auth.user?.role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router]);

  const menuItems = [
    { href: '/myoffice/brand', label: t.brand, icon: <Store /> },
    { href: '/myoffice/services', label: t.services, icon: <LayoutGrid /> },
    { href: '/myoffice/products', label: t.products, icon: <ShoppingBag /> },
    { href: '/myoffice/questionnaires', label: t.questionnaires, icon: <FileText /> },
    { href: '/myoffice/integrations', label: t.integrations, icon: <Puzzle /> },
    { href: '/myoffice/admin', label: t.admin, icon: <ShieldCheck /> },
  ];

  if (auth.user?.role !== 'admin') {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>{t.redirecting}</p>
      </div>
    );
  }

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
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">{site.brand.name}</span>
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
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
