
'use client';

import dynamic from 'next/dynamic';
import { HeroBanner } from '@/components/sections/herobanner';
import { HeroText } from '@/components/sections/herotext';
import { Services } from '@/components/sections/services';
import { Products } from '@/components/sections/products';
import { Contact } from '@/components/sections/contact';
const AIChatWidget = dynamic(() => import('@/components/ai-chat-widget').then(m => m.AIChatWidget), { ssr: false });

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <HeroText />
      <Services />
      <Products />
      <Contact />
      <AIChatWidget />
    </>
  );
}
