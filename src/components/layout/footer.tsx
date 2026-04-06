
'use client';

import Link from 'next/link';
import { KeyRound, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Hash, Music2, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useSite } from '@/hooks/use-site';
import type { SocialPlatform } from '@/lib/types';

const labels = {
  es: {
    rightsReserved: "Todos los derechos reservados.",
    home: "Página Principal",
    myOffice: "Mi Oficina",
    login: "Iniciar Sesión",
    instructions: "Instrucciones",
    privacy: 'Privacidad',
    terms: 'Términos',
    legal: 'Legal',
    followUs: 'Síguenos',
    opensInNewTab: 'abre en una nueva pestaña',
  },
  en: {
    rightsReserved: "All rights reserved.",
    home: "Home",
    myOffice: "My Office",
    login: "Login",
    instructions: "Instructions",
    privacy: 'Privacy',
    terms: 'Terms',
    legal: 'Legal',
    followUs: 'Follow us',
    opensInNewTab: 'opens in a new tab',
  },
  fr: {
    rightsReserved: "Tous droits réservés.",
    home: "Accueil",
    myOffice: "Mon Bureau",
    login: "Connexion",
    instructions: "Instructions",
    privacy: 'Confidentialité',
    terms: 'Conditions',
    legal: 'Mentions légales',
    followUs: 'Suivez-nous',
    opensInNewTab: 'ouvre dans un nouvel onglet',
  }
};

const socialDefs: Array<{ key: SocialPlatform; label: string; icon: typeof Facebook }> = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'x', label: 'X', icon: Hash },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'tiktok', label: 'TikTok', icon: Music2 },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { key: 'threads', label: 'Threads', icon: AtSign },
];

export function Footer() {
  const { language, getTranslation } = useLanguage();
  const { site } = useSite();
  const { auth } = useAuth();
  const t = labels[language.code] || labels.en;

  const siteName = getTranslation(site.brand.name);
  const activeSocialLinks = socialDefs
    .map((item) => ({ ...item, href: site.socialLinks?.[item.key]?.trim() ?? '' }))
    .filter((item) => item.href.length > 0);

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 md:py-10">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <KeyRound className="h-6 w-6 text-accent" />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} {siteName}. {t.rightsReserved}
          </p>
        </div>

        {activeSocialLinks.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{t.followUs}</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {activeSocialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.key} variant="outline" size="icon" className="focus-visible:ring-accent focus-visible:ring-offset-2" asChild>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.label} - ${t.opensInNewTab}`}
                      title={`${item.label} - ${t.opensInNewTab}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="ghost" asChild><Link href="/">{t.home}</Link></Button>
            <Button variant="ghost" asChild><Link href="/instructions">{t.instructions}</Link></Button>
            <Button variant="ghost" asChild><Link href="/privacy">{t.privacy}</Link></Button>
            <Button variant="ghost" asChild><Link href="/terms">{t.terms}</Link></Button>
            <Button variant="ghost" asChild><Link href="/legal">{t.legal}</Link></Button>
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
