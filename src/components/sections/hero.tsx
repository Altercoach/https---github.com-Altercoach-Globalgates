'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';
import { useLanguage } from '@/hooks/use-language';
import { CheckCircle } from 'lucide-react';

export function Hero() {
  const { site } = useSite();
  const { translatedSite } = useLanguage();

  const brand = translatedSite.brand || site.brand;

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
                    <span>Automatización con Agentes de IA</span>
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Embudos de Venta (Funnels) Medibles</span>
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Marca, Contenido y Anuncios</span>
                </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button onClick={scrollToPlans} size="lg">
                Explorar Planes
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
