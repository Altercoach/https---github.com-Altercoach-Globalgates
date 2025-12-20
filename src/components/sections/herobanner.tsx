'use client';

import Image from 'next/image';
import { useSite } from '@/hooks/use-site';

export function HeroBanner() {
  const { site } = useSite();

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src={site.brand.heroImage || '/hero-default.jpg'}
          alt="Hero Image"
          fill
          className="object-cover"
          data-ai-hint="business marketing"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </section>
  );
}
