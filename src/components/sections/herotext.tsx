'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { CheckCircle } from 'lucide-react';
import { useSite } from '@/hooks/use-site';
import Link from 'next/link';

const labels = {
  es: {
    explorePlans: "Explorar Planes",
    signupFree: "Regístrate Gratis",
    bullet1: "Automatización con Agentes de IA",
    bullet2: "Embudos de Venta (Funnels) Medibles",
    bullet3: "Marca, Contenido y Anuncios",
  },
  en: {
    explorePlans: "Explore Plans",
    signupFree: "Sign Up Free",
    bullet1: "Automation with AI Agents",
    bullet2: "Measurable Sales Funnels",
    bullet3: "Brand, Content, and Ads",
  },
  fr: {
    explorePlans: "Explorer les Forfaits",
    signupFree: "Inscrivez-vous Gratuitement",
    bullet1: "Automatisation avec des Agents IA",
    bullet2: "Entonnoirs de Vente Mesurables",
    bullet3: "Marque, Contenu et Publicités",
  }
};


export function HeroText() {
  const { language, getTranslation } = useLanguage();
  const { site } = useSite();
  const t = labels[language.code] || labels.en;

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-background">
      <div className="container relative z-10 -mt-14 px-4 md:-mt-28 md:px-6">
        <div className="mx-auto max-w-4xl rounded-lg bg-background p-6 text-center shadow-2xl md:p-12">
                <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                    {getTranslation(site.brand.heroTitle)}
                    </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-xl">
                    {getTranslation(site.brand.heroSubtitle)}
                    </p>
                </div>
          <ul className="grid gap-3 py-6 text-left text-base sm:grid-cols-3 sm:text-lg">
                    <li className="flex items-center justify-center sm:justify-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span>{t.bullet1}</span>
                    </li>
                    <li className="flex items-center justify-center sm:justify-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span>{t.bullet2}</span>
                    </li>
                    <li className="flex items-center justify-center sm:justify-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span>{t.bullet3}</span>
                    </li>
                </ul>
                  <div className="flex flex-col justify-center gap-3 min-[420px]:flex-row">
                    <Button asChild size="lg" className="w-full min-[420px]:w-auto">
                        <Link href="/signup">{t.signupFree}</Link>
                    </Button>
                    <Button onClick={scrollToPlans} size="lg" variant="secondary" className="w-full min-[420px]:w-auto">
                        {t.explorePlans}
                    </Button>
                </div>
            </div>
        </div>
    </section>
  );
}
