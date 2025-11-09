
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bot, MessageSquare, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';

const labels = {
  es: {
    pageTitle: "Integraciones y Agente de IA",
    pageSubtitle: "Conecta tus canales y configura tu asistente virtual.",
    agentCardTitle: "Agente de IA Global",
    agentCardDescription: "Configura la personalidad, conocimiento y reglas de tu agente de IA.",
    configureAgent: "Configurar Agente",
    channelsTitle: "Canales de Mensajería",
    channelsDescription: "Activa los canales donde operará tu agente de IA. (Simulación)",
    integrations: {
      whatsapp: { name: 'WhatsApp', description: 'Conecta con la API de WhatsApp Business.' },
      messenger: { name: 'Facebook Messenger', description: 'Atiende a clientes en Messenger.' },
      instagram: { name: 'Instagram DMs', description: 'Gestiona mensajes directos de Instagram.' },
      telegram: { name: 'Telegram', description: 'Implementa tu agente en un bot de Telegram.' },
      webchat: { name: 'Web Chat (Sitio Web)', description: 'Añade un widget de chat a tu página.' },
      email: { name: 'Email', description: 'Responde a correos de soporte o ventas.' },
      linkedin: { name: 'LinkedIn', description: 'Gestiona mensajes y perfiles B2B.' },
      twitter: { name: 'X (Twitter)', description: 'Interactúa en tiempo real con tu comunidad.' },
    }
  },
  en: {
    pageTitle: "Integrations & AI Agent",
    pageSubtitle: "Connect your channels and configure your virtual assistant.",
    agentCardTitle: "Global AI Agent",
    agentCardDescription: "Configure the personality, knowledge, and rules of your AI agent.",
    configureAgent: "Configure Agent",
    channelsTitle: "Messaging Channels",
    channelsDescription: "Activate the channels where your AI agent will operate. (Simulation)",
    integrations: {
      whatsapp: { name: 'WhatsApp', description: 'Connect with the WhatsApp Business API.' },
      messenger: { name: 'Facebook Messenger', description: 'Serve customers on Messenger.' },
      instagram: { name: 'Instagram DMs', description: 'Manage Instagram direct messages.' },
      telegram: { name: 'Telegram', description: 'Deploy your agent in a Telegram bot.' },
      webchat: { name: 'Web Chat (Website)', description: 'Add a chat widget to your page.' },
      email: { name: 'Email', description: 'Respond to support or sales emails.' },
      linkedin: { name: 'LinkedIn', description: 'Manage B2B messages and profiles.' },
      twitter: { name: 'X (Twitter)', description: 'Interact in real-time with your community.' },
    }
  },
  fr: {
    pageTitle: "Intégrations & Agent IA",
    pageSubtitle: "Connectez vos canaux et configurez votre assistant virtuel.",
    agentCardTitle: "Agent IA Global",
    agentCardDescription: "Configurez la personnalité, les connaissances et les règles de votre agent IA.",
    configureAgent: "Configurer l'Agent",
    channelsTitle: "Canaux de Messagerie",
    channelsDescription: "Activez les canaux où votre agent IA fonctionnera. (Simulation)",
    integrations: {
      whatsapp: { name: 'WhatsApp', description: 'Connectez-vous à l\'API WhatsApp Business.' },
      messenger: { name: 'Facebook Messenger', description: 'Servez les clients sur Messenger.' },
      instagram: { name: 'Instagram DMs', description: 'Gérez les messages directs d\'Instagram.' },
      telegram: { name: 'Telegram', description: 'Déployez votre agent dans un bot Telegram.' },
      webchat: { name: 'Web Chat (Site Web)', description: 'Ajoutez un widget de chat à votre page.' },
      email: { name: 'Email', description: 'Répondez aux e-mails de support ou de vente.' },
      linkedin: { name: 'LinkedIn', description: 'Gérez les messages et profils B2B.' },
      twitter: { name: 'X (Twitter)', description: 'Interagissez en temps réel avec votre communauté.' },
    }
  }
};


type IntegrationId = 'whatsapp' | 'messenger' | 'instagram' | 'telegram' | 'webchat' | 'email' | 'linkedin' | 'twitter';

const channelIntegrations: { id: IntegrationId; icon: React.ReactNode }[] = [
    { id: 'whatsapp', icon: <MessageSquare /> },
    { id: 'messenger', icon: <MessageSquare /> },
    { id: 'instagram', icon: <MessageSquare /> },
    { id: 'telegram', icon: <MessageSquare /> },
    { id: 'webchat', icon: <MessageSquare /> },
    { id: 'email', icon: <MessageSquare /> },
    { id: 'linkedin', icon: <Linkedin /> },
    { id: 'twitter', icon: <Twitter /> },
];

export default function IntegrationsPage() {
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
                <p className="text-muted-foreground">{t.pageSubtitle}</p>
            </header>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> {t.agentCardTitle}</CardTitle>
                    <CardDescription>{t.agentCardDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/myoffice/agent">{t.configureAgent}</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.channelsTitle}</CardTitle>
                    <CardDescription>{t.channelsDescription}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channelIntegrations.map(({id, icon}) => {
                        const intl = t.integrations[id];
                        return (
                            <div key={id} className="p-4 border rounded-lg flex items-start gap-4">
                                <div className="text-muted-foreground mt-1">{icon}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{intl.name}</h3>
                                        <Switch aria-label={`Enable ${intl.name}`} />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{intl.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
