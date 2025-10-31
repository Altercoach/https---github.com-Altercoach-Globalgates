
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

export default function MyOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { site } = useSite();
  const { auth, logout } = useAuth();

  useEffect(() => {
    if (auth.user?.role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router]);

  const menuItems = [
    { href: '/myoffice/brand', label: 'Marca', icon: <Store /> },
    { href: '/myoffice/services', label: 'Servicios', icon: <LayoutGrid /> },
    { href: '/myoffice/products', label: 'Productos', icon: <ShoppingBag /> },
    { href: '/myoffice/questionnaires', label: 'Cuestionarios', icon: <FileText /> },
    { href: '/myoffice/integrations', label: 'Integraciones', icon: <Puzzle /> },
    { href: '/myoffice/admin', label: 'Admin', icon: <ShieldCheck /> },
  ];

  if (auth.user?.role !== 'admin') {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Redirigiendo...</p>
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
                  tooltip={{ children: 'Vista Cliente' }}
                >
                  <Link href="/dashboard">
                    <User />
                    <span>Vista Cliente</span>
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
            <span className="text-sm text-muted-foreground mr-4">Conectado como: {auth.user.email}</span>
            <Button onClick={logout} variant="outline" size="sm">Cerrar Sesión</Button>
            <Button asChild variant="outline" size="sm" className="ml-2">
              <Link href="/">Ver Sitio</Link>
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
