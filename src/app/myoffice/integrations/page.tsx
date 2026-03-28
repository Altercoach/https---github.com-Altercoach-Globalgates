'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RouteGuard } from '@/components/auth/route-guard';
import { useIntegration } from '@/hooks/use-integration';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Linkedin, Twitter, Mail, Rss, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

type IntegrationId = 'whatsapp' | 'messenger' | 'instagram' | 'telegram' | 'webchat' | 'email' | 'linkedin' | 'twitter';

const labels = {
  es: {
    pageTitle: 'Integraciones y Agente de IA',
    pageSubtitle: 'Conecta tus canales y configura tu asistente virtual.',
    agentCardTitle: 'Agente de IA Global',
    agentCardDescription: 'Configura la personalidad, conocimiento y claves de API de tu agente.',
    configureAgent: 'Configurar Agente',
    channelsTitle: 'Canales de Mensajeria',
    channelsDescription: 'Activa los canales donde operara tu agente de IA. (Simulacion)',
    integrations: {
      whatsapp: { name: 'WhatsApp', description: 'Conecta con la API de WhatsApp Business.' },
      messenger: { name: 'Facebook Messenger', description: 'Atiende a clientes en Messenger.' },
      instagram: { name: 'Instagram DMs', description: 'Gestiona mensajes directos de Instagram.' },
      telegram: { name: 'Telegram', description: 'Implementa tu agente en un bot de Telegram.' },
      webchat: { name: 'Web Chat (Sitio Web)', description: 'Anade un widget de chat a tu pagina.' },
      email: { name: 'Email', description: 'Responde a correos de soporte o ventas.' },
      linkedin: { name: 'LinkedIn', description: 'Gestiona mensajes y perfiles B2B.' },
      twitter: { name: 'X (Twitter)', description: 'Interactua en tiempo real con tu comunidad.' },
    },
  },
  en: {
    pageTitle: 'Integrations & AI Agent',
    pageSubtitle: 'Connect your channels and configure your virtual assistant.',
    agentCardTitle: 'Global AI Agent',
    agentCardDescription: 'Configure the personality, knowledge, and API keys of your AI agent.',
    configureAgent: 'Configure Agent',
    channelsTitle: 'Messaging Channels',
    channelsDescription: 'Activate the channels where your AI agent will operate. (Simulation)',
    integrations: {
      whatsapp: { name: 'WhatsApp', description: 'Connect with the WhatsApp Business API.' },
      messenger: { name: 'Facebook Messenger', description: 'Serve customers on Messenger.' },
      instagram: { name: 'Instagram DMs', description: 'Manage Instagram direct messages.' },
      telegram: { name: 'Telegram', description: 'Deploy your agent in a Telegram bot.' },
      webchat: { name: 'Web Chat (Website)', description: 'Add a chat widget to your page.' },
      email: { name: 'Email', description: 'Respond to support or sales emails.' },
      linkedin: { name: 'LinkedIn', description: 'Manage B2B messages and profiles.' },
      twitter: { name: 'X (Twitter)', description: 'Interact in real-time with your community.' },
    },
  },
  fr: {
    pageTitle: 'Integrations & Agent IA',
    pageSubtitle: 'Connectez vos canaux et configurez votre assistant virtuel.',
    agentCardTitle: 'Agent IA Global',
    agentCardDescription: 'Configurez la personnalite, les connaissances et les cles API de votre agent IA.',
    configureAgent: "Configurer l'Agent",
    channelsTitle: 'Canaux de Messagerie',
    channelsDescription: 'Activez les canaux ou votre agent IA fonctionnera. (Simulation)',
    integrations: {
      whatsapp: { name: 'WhatsApp', description: "Connectez-vous a l'API WhatsApp Business." },
      messenger: { name: 'Facebook Messenger', description: 'Servez les clients sur Messenger.' },
      instagram: { name: 'Instagram DMs', description: "Gerez les messages directs d'Instagram." },
      telegram: { name: 'Telegram', description: 'Deployez votre agent dans un bot Telegram.' },
      webchat: { name: 'Web Chat (Site Web)', description: 'Ajoutez un widget de chat a votre page.' },
      email: { name: 'Email', description: 'Repondez aux e-mails de support ou de vente.' },
      linkedin: { name: 'LinkedIn', description: 'Gerez les messages et profils B2B.' },
      twitter: { name: 'X (Twitter)', description: 'Interagissez en temps reel avec votre communaute.' },
    },
  },
};

const channelIntegrations: { id: IntegrationId; icon: React.ReactNode }[] = [
  { id: 'whatsapp', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'messenger', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'instagram', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'telegram', icon: <Rss className="h-5 w-5" /> },
  { id: 'webchat', icon: <Globe className="h-5 w-5" /> },
  { id: 'email', icon: <Mail className="h-5 w-5" /> },
  { id: 'linkedin', icon: <Linkedin className="h-5 w-5" /> },
  { id: 'twitter', icon: <Twitter className="h-5 w-5" /> },
];

function ChannelCard({ id, icon }: { id: IntegrationId; icon: React.ReactNode }) {
  const { language } = useLanguage();
  const langCode = language.code as keyof typeof labels;
  const t = labels[langCode] ?? labels.en;
  const { status, connect, disconnect } = useIntegration(id);
  const integration = t.integrations[id];

  return (
    <div className="flex items-center gap-4 border rounded-lg p-4">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold">{integration.name}</div>
        <div className="text-xs text-muted-foreground">{integration.description}</div>
      </div>
      <Switch
        checked={status.connected}
        onCheckedChange={checked => (checked ? connect() : disconnect())}
      />
    </div>
  );
}

export default function IntegrationsPage() {
  const { language } = useLanguage();
  const langCode = language.code as keyof typeof labels;
  const t = labels[langCode] ?? labels.en;

  return (
    <RouteGuard requireAuth requireRole="admin">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{t.agentCardTitle}</CardTitle>
            <CardDescription>{t.agentCardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/myoffice/agent">{t.configureAgent}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.channelsTitle}</CardTitle>
            <CardDescription>{t.channelsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {channelIntegrations.map(({ id, icon }) => (
              <ChannelCard key={id} id={id} icon={icon} />
            ))}
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
