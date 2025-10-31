
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { CheckCircle } from 'lucide-react';

const labels = {
  es: {
    explorePlans: "Explorar Planes",
    bullet1: "Automatización con Agentes de IA",
    bullet2: "Embudos de Venta (Funnels) Medibles",
    bullet3: "Marca, Contenido y Anuncios",
  },
  en: {
    explorePlans: "Explore Plans",
    bullet1: "Automation with AI Agents",
    bullet2: "Measurable Sales Funnels",
    bullet3: "Brand, Content, and Ads",
  },
  fr: {
    explorePlans: "Explorer les Forfaits",
    bullet1: "Automatisation avec des Agents IA",
    bullet2: "Entonnoirs de Vente Mesurables",
    bullet3: "Marque, Contenu et Publicités",
  }
};


export function Hero() {
  const { translatedSite, language } = useLanguage();

  const t = labels[language.code as keyof typeof labels] || labels.en;
  
  const brand = translatedSite.brand;

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                {brand.heroTitle}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {brand.heroSubtitle}
              </p>
            </div>
            <ul className="grid gap-2 text-lg">
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
              <Button onClick={scrollToPlans} size="lg">
                {t.explorePlans}
              </Button>
            </div>
          </div>
          <Image
            src={brand.heroImage || 'https://picsum.photos/seed/rocket/600/400'}
            alt="Hero Image"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            data-ai-hint="business marketing"
            priority
          />
        </div>
      </div>
    </section>
  );
}
