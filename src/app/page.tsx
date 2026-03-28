'use client';

import { HeroBanner } from '@/components/sections/herobanner';
import { HeroText } from '@/components/sections/herotext';
import { Services } from '@/components/sections/services';
import { Products } from '@/components/sections/products';
import { Contact } from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <HeroText />
      <Services />
      <Products />
      <Contact />
    </>
  );
}
