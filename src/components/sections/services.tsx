
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const labels = {
    es: {
        title: "Servicios Estratégicos",
        subtitle: "Soluciones integradas para adquisición, conversión y retención de clientes."
    },
    en: {
        title: "Strategic Services",
        subtitle: "Integrated solutions for customer acquisition, conversion, and retention."
    },
    fr: {
        title: "Services Stratégiques",
        subtitle: "Solutions intégrées pour l'acquisition, la conversion et la fidélisation des clients."
    }
};

export function Services() {
  const { translatedSite, language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  
  const services = translatedSite.services;

  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t.title}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {service.bullets.map((bullet, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{bullet}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
