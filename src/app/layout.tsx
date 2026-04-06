import { ChatWidgetProvider } from '@/contexts/chat-widget-context';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SiteProvider } from '@/contexts/site-context';
import { LanguageProvider } from '@/contexts/language-context';
import { CurrencyProvider } from '@/contexts/currency-context';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { AIChatWidget } from '@/components/ai-chat-widget';

import { ThemeProvider } from '@/contexts/theme-provider';
import { FeatureFlagProvider } from '@/contexts/feature-flag-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://goldenkey.website'),
  title: {
    default: 'Goldek Key International',
    template: '%s | Goldek Key International',
  },
  alternates: {
    canonical: '/',
  },
  description: 'Estrategia de marketing digital, automatización e inteligencia artificial para hacer crecer tu negocio. AI-powered digital strategy to grow your business.',
  keywords: ['marketing digital', 'inteligencia artificial', 'automatización', 'agencia IA', 'Goldek Key International'],
  authors: [{ name: 'Goldek Key International', url: 'https://goldenkey.website' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    alternateLocale: ['en_US', 'fr_FR'],
    siteName: 'Goldek Key International',
    title: 'Goldek Key International',
    description: 'Estrategia digital con IA para hacer crecer tu negocio.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <ChatWidgetProvider>
            <SiteProvider>
              <LanguageProvider>
                <CurrencyProvider>
                  <CartProvider>
                    <AuthProvider>
                      <FeatureFlagProvider>
                        {children}
                        <AIChatWidget />
                        <Toaster />
                      </FeatureFlagProvider>
                    </AuthProvider>
                  </CartProvider>
                </CurrencyProvider>
              </LanguageProvider>
            </SiteProvider>
          </ChatWidgetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
