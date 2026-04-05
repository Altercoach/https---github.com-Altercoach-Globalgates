'use client';

import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Wand } from 'lucide-react';
import { useSite } from '@/hooks/use-site';
import { useChatWidget } from '@/hooks/use-chat-widget';
import { Button } from '../ui/button';

const labels = {
    es: {
        title: "Nuestras Soluciones",
        subtitle: "Soluciones integradas para adquisición, conversión y retención de clientes.",
        askMore: "Pregúntame más",
        askMoreInitialMessage: "Hola, me gustaría saber más sobre la solución",
    },
    en: {
        title: "Our Solutions",
        subtitle: "Integrated solutions for customer acquisition, conversion, and retention.",
        askMore: "Ask me more",
        askMoreInitialMessage: "Hi, I'd like to know more about the solution",
    },
    fr: {
        title: "Nos Solutions",
        subtitle: "Solutions intégrées pour l'acquisition, la conversion et la fidélisation des clients.",
        askMore: "Demandez-moi plus",
        askMoreInitialMessage: "Bonjour, j'aimerais en savoir plus sur la solution",
    }
};

export function Services() {
  const { language, getTranslation } = useLanguage();
  const { openChatWidget } = useChatWidget();
  const { site } = useSite();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  
  const services = site.services.filter(s => s.visible);

  const handleAskMore = (title: string) => {
    openChatWidget(`${t.askMoreInitialMessage} "${title}".`);
  }

  return (
    <section id="solutions" className="w-full py-12 md:py-24 lg:py-32 bg-background">
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
          {services.map((service) => {
            const serviceTitle = getTranslation(service.title);
            return (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{serviceTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  {service.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{getTranslation(bullet)}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleAskMore(serviceTitle)}>
                    <Wand className="mr-2" />
                    {t.askMore}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
