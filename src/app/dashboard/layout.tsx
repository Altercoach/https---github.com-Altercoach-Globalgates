
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, LogOut, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { auth, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user?.role !== 'customer') {
      router.push('/login');
    }
  }, [auth, router]);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  if (auth.user?.role !== 'customer') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }
  
  const DesktopNav = () => (
    <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <User className="h-6 w-6" />
                    <span>Panel de Cliente</span>
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
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    </div>
  );

  const MobileNav = () => (
     <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:hidden">
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                    >
                        <User className="h-6 w-6" />
                        <span>Panel de Cliente</span>
                    </Link>
                    {navItems.map(item => (
                         <Link
                            key={item.href}
                            href={item.href}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                 <div className="mt-auto">
                    <Button size="sm" className="w-full" onClick={logout}>
                       <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <span className="font-semibold">Dashboard</span>
        </div>
         <Button variant="outline" size="sm" asChild>
            <Link href="/">Volver al Sitio</Link>
        </Button>
    </header>
  );


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
       <DesktopNav />
        <div className="flex flex-col">
            <MobileNav />
            <main className="flex-1 p-4 sm:px-6 sm:py-6 bg-muted/20">
                {children}
            </main>
        </div>
    </div>
  );
}
