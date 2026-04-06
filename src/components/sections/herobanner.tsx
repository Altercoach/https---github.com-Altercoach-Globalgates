'use client';

import Image from 'next/image';
import { useSite } from '@/hooks/use-site';
import { useLanguage } from '@/hooks/use-language';

export function HeroBanner() {
  const { site } = useSite();
  const { getTranslation } = useLanguage();

  return (
    <section className="relative w-full h-[62vh] md:h-[74vh] lg:h-[78vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src={site.brand.heroImage || '/hero-default.jpg'}
          alt={`${getTranslation(site.brand.name)} - hero`}
          fill
          className="object-cover object-center"
          data-ai-hint="business marketing"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </section>
  );
}
