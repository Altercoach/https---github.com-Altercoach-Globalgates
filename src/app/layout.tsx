
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SiteProvider } from '@/contexts/site-context';
import { LanguageProvider } from '@/contexts/language-context';
import { CurrencyProvider } from '@/contexts/currency-context';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'GlobalGate Agency',
  description: 'Strategic marketing, automation, and AI to unlock your growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <CartProvider>
                  <AuthProvider>
                    {children}
                    <Toaster />
                  </AuthProvider>
                </CartProvider>
              </CurrencyProvider>
            </LanguageProvider>
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
