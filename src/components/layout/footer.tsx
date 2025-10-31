
'use client';

import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';

const labels = {
  es: {
    rightsReserved: "Todos los derechos reservados.",
    home: "Inicio",
    myOffice: "Mi Oficina",
    login: "Iniciar Sesión"
  },
  en: {
    rightsReserved: "All rights reserved.",
    home: "Home",
    myOffice: "My Office",
    login: "Login"
  },
  fr: {
    rightsReserved: "Tous droits réservés.",
    home: "Accueil",
    myOffice: "Mon Bureau",
    login: "Connexion"
  }
};

export function Footer() {
  const { translatedSite, language } = useLanguage();
  const { auth } = useAuth();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const siteName = translatedSite.brand.name;

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <KeyRound className="h-6 w-6 text-accent" />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} {siteName}. {t.rightsReserved}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild><Link href="/">{t.home}</Link></Button>
            {auth.user?.role === 'admin' ? (
               <Button variant="ghost" asChild><Link href="/myoffice">{t.myOffice}</Link></Button>
            ) : (
               <Button variant="ghost" asChild><Link href="/login">{t.login}</Link></Button>
            )}
        </div>
      </div>
    </footer>
  );
}
