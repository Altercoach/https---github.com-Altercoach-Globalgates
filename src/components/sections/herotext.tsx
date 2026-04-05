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
      <div className="container px-4 md:px-6 -mt-20 md:-mt-28 relative z-10">
            <div className="bg-background p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl mx-auto text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-foreground">
                    {getTranslation(site.brand.heroTitle)}
                    </h1>
                    <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
                    {getTranslation(site.brand.heroSubtitle)}
                    </p>
                </div>
                <ul className="grid gap-4 py-6 text-lg sm:grid-cols-3">
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
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                    <Button asChild size="lg">
                        <Link href="/signup">{t.signupFree}</Link>
                    </Button>
                    <Button onClick={scrollToPlans} size="lg" variant="secondary">
                        {t.explorePlans}
                    </Button>
                </div>
            </div>
        </div>
    </section>
  );
}
