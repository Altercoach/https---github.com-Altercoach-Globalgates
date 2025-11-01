'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { ChatWidgetProvider } from "@/contexts/chat-widget-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatWidgetProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <AIChatWidget />
      </div>
    </ChatWidgetProvider>
  );
}
