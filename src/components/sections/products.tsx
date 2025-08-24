'use client';

import { useSite } from '@/hooks/use-site';
import { useLanguage } from '@/hooks/use-language';
import { ProductCard } from '@/components/product-card';

export function Products() {
  const { site } = useSite();
  const { translatedSite } = useLanguage();

  const products = translatedSite.products || site.products;

  return (
    <section id="plans" className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Plans and Packages</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Purchase online. Subscriptions are billed monthly.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4 pt-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>* Branding (4 posts): cost = advertising spend (min $250 USD).</p>
            <p>* FREE Market Research when you purchase an annual Funnel, Branding, or Content plan.</p>
        </div>
      </div>
    </section>
  );
}
