'use client';

import Image from 'next/image';
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


export function Hero() {
  const { language, getTranslation } = useLanguage();
  const { site } = useSite();
  const t = labels[language.code] || labels.en;

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={site.brand.heroImage || '/hero-default.jpg'}
          alt="Hero Image"
          fill
          className="object-cover"
          data-ai-hint="business marketing"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col justify-center space-y-4 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
              {getTranslation(site.brand.heroTitle)}
            </h1>
            <p className="max-w-[600px] text-gray-200 md:text-xl">
              {getTranslation(site.brand.heroSubtitle)}
            </p>
          </div>
          <ul className="grid gap-2 py-4 text-lg">
              <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>{t.bullet1}</span>
              </li>
              <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>{t.bullet2}</span>
              </li>
              <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>{t.bullet3}</span>
              </li>
          </ul>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">{t.signupFree}</Link>
            </Button>
            <Button onClick={scrollToPlans} size="lg" variant="outline">
              {t.explorePlans}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
