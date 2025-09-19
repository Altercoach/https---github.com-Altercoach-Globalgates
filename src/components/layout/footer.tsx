
'use client';

import Link from 'next/link';
import { useSite } from '@/hooks/use-site';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export function Footer() {
  const { site } = useSite();
  const { translatedSite } = useLanguage();

  const siteName = translatedSite?.brand?.name || site.brand.name;

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <KeyRound className="h-6 w-6 text-accent" />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} {siteName}. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild><Link href="/">Inicio</Link></Button>
            <Button variant="ghost" asChild><Link href="/myoffice">Mi Oficina</Link></Button>
            <Button variant="ghost" asChild><Link href="/login">Iniciar Sesión</Link></Button>
        </div>
      </div>
    </footer>
  );
}
