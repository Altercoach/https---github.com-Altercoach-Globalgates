'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useChatWidget } from '@/hooks/use-chat-widget';
import { useLanguage } from '@/hooks/use-language';
import { useSite } from '@/hooks/use-site';

const labels = {
  es: {
    title: 'Chat del Agente',
    subtitle: 'La ventana del chat se abrirá automáticamente en la esquina inferior derecha.',
    hint: 'Si no se abre, recarga la página o usa el botón flotante.',
  },
  en: {
    title: 'Agent Chat',
    subtitle: 'The chat window will open automatically in the bottom-right corner.',
    hint: 'If it does not open, refresh the page or use the floating button.',
  },
  fr: {
    title: 'Chat de l\'Agent',
    subtitle: 'La fenetre de chat s\'ouvrira automatiquement en bas a droite.',
    hint: 'Si elle ne s\'ouvre pas, rechargez la page ou utilisez le bouton flottant.',
  },
};

export default function ChatLandingPage() {
  const { setIsWidgetOpen } = useChatWidget();
  const { language } = useLanguage();
  const { site } = useSite();
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? '';

  const t = labels[language.code as keyof typeof labels] || labels.en;

  useEffect(() => {
    setIsWidgetOpen(true);
  }, [setIsWidgetOpen]);

  return (
    <section className="container py-12 md:py-20">
      <div className="mx-auto max-w-2xl rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold font-headline">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        <p className="mt-3 text-sm text-muted-foreground">{t.hint}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          {site.agentPersona.firstName} {site.agentPersona.lastName} · /chat/{slug}
        </p>
      </div>
    </section>
  );
}
