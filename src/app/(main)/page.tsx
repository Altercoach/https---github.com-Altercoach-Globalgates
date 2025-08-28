'use client';

import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { Products } from '@/components/sections/products';
import { Contact } from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Products />
      <Contact />
    </>
  );
}
