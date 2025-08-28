
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
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KeyRound, LayoutGrid, ShoppingBag, Store, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';
import { ThemeProvider } from 'next-themes';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { site } = useSite();

  const menuItems = [
    { href: '/editor/brand', label: 'Brand', icon: <Store /> },
    { href: '/editor/services', label: 'Services', icon: <LayoutGrid /> },
    { href: '/editor/products', label: 'Products', icon: <ShoppingBag /> },
    { href: '/editor/integrations', label: 'Integrations', icon: <Puzzle /> },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                    >
                    <Link href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center justify-between border-b bg-background p-2">
                <SidebarTrigger />
                <Button asChild variant="outline">
                    <Link href="/">View Site</Link>
                </Button>
            </header>
            <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
        </SidebarProvider>
    </ThemeProvider>
  );
}
