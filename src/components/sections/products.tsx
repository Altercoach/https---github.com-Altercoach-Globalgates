'use client';

import { useSite } from '@/hooks/use-site';
import { useLanguage } from '@/hooks/use-language';
import { ProductCard } from '@/components/product-card';
import { PlanRecommender } from '../plan-recommender';

export function Products() {
  const { site } = useSite();
  const { translatedSite } = useLanguage();

  const products = translatedSite.products || site.products;

  return (
    <section id="plans" className="w-full bg-primary/5 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Planes y Paquetes</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Compra en línea. Las suscripciones se facturan mensualmente.
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
            <p>* Branding (8 publicaciones): el costo de pauta publicitaria no está incluido (inversión mínima de $250 USD).</p>
            <p>* Branding (4 publicaciones): el costo del servicio es igual al monto de la pauta publicitaria (inversión mínima de $250 USD).</p>
            <p>* Estudio de Mercado GRATIS al contratar un plan anual de Funnel, Branding o Contenido.</p>
        </div>
      </div>
    </section>
  );
}
