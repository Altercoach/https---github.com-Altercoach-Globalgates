
'use client';

import { useSite } from '@/hooks/use-site';
import { useLanguage } from '@/hooks/use-language';
import { ProductCard } from '@/components/product-card';
import { PlanRecommender } from '../plan-recommender';

const labels = {
  es: {
    title: "Planes y Paquetes",
    subtitle: "Compra en línea, crea tu cuenta y gestiona tus servicios. Las suscripciones se renuevan automáticamente.",
    disclaimer1: "* Branding (8 publicaciones): el costo de pauta publicitaria no está incluido (inversión mínima de $250 USD).",
    disclaimer2: "* Branding (4 publicaciones): el costo del servicio es igual al monto de la pauta publicitaria (inversión mínima de $250 USD).",
    disclaimer3: "* Estudio de Mercado GRATIS al contratar un plan anual de Funnel, Branding o Contenido.",
  },
  en: {
    title: "Plans and Packages",
    subtitle: "Buy online, create your account, and manage your services. Subscriptions are automatically renewed.",
    disclaimer1: "* Branding (8 posts): advertising cost is not included (minimum investment of $250 USD).",
    disclaimer2: "* Branding (4 posts): service cost equals the ad spend amount (minimum $250 USD).",
    disclaimer3: "* FREE Market Research when hiring an annual Funnel, Branding, or Content plan.",
  },
  fr: {
    title: "Forfaits et Paquets",
    subtitle: "Achetez en ligne, créez votre compte et gérez vos services. Les abonnements sont renouvelés automatiquement.",
    disclaimer1: "* Branding (8 publications) : le coût de la publicité n'est pas inclus (investissement minimum de 250 $ US).",
    disclaimer2: "* Branding (4 publications) : le coût du service est égal au montant des dépenses publicitaires (minimum 250 $ US).",
    disclaimer3: "* Étude de marché GRATUITE à la location d'un plan annuel Funnel, Branding ou Contenu.",
  }
};


export function Products() {
  const { site } = useSite();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const products = site.products;

  return (
    <section id="plans" className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">{t.title}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.subtitle}
            </p>
          </div>
           <div className="pt-4">
            <PlanRecommender />
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 pt-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>{t.disclaimer1}</p>
            <p>{t.disclaimer2}</p>
            <p>{t.disclaimer3}</p>
        </div>
      </div>
    </section>
  );
}
