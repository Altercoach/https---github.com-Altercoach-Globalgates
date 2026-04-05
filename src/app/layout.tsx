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
  title: 'Golden Key Agency',
  description: 'Strategic marketing, automation, and AI to unlock your growth.',
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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
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
