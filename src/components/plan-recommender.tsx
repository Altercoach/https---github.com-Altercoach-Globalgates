

'use client';

import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useChatWidget } from '@/hooks/use-chat-widget';

const labels = {
  es: {
    trigger: "Obtener Recomendación de IA",
    initialMessage: "¡Hola! Quiero que me ayudes a encontrar el mejor plan para mi negocio."
  },
  en: {
    trigger: "Get AI Recommendation",
    initialMessage: "Hi! I'd like you to help me find the best plan for my business."
  },
    fr: {
    trigger: "Obtenir une Recommandation IA",
    initialMessage: "Bonjour! J'aimerais que vous m'aidiez à trouver le meilleur forfait pour mon entreprise."
  }
};


export function PlanRecommender() {
    const { language } = useLanguage();
    const { openChatWidget } = useChatWidget();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const handleRecommendationClick = () => {
        openChatWidget(t.initialMessage);
    }

    return (
        <Button variant="default" size="lg" className="gap-2" onClick={handleRecommendationClick}>
            <Wand />
            {t.trigger}
        </Button>
    );
}
