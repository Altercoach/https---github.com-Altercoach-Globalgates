
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Bot, Puzzle } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    pageTitle: "Integraciones",
    pageSubtitle: "Conecta tu sitio con servicios de terceros.",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Configuración guardada!",
    toastSuccessDescription: "Tus integraciones han sido actualizadas.",
    apiKeyLabel: "API Key",
    apiKeyPlaceholder: "Introduce tu API Key",
    integrations: {
      stripe: { name: 'Stripe', description: 'Acepta pagos con tarjeta de crédito de forma segura en todo el mundo.' },
      mercadopago: { name: 'Mercado Pago', description: 'Procesa pagos locales en Latinoamérica con las opciones más populares.' },
      aiagent: { name: 'Agente de IA', description: 'Automatiza la atención al cliente con un asistente virtual inteligente.' },
    }
  },
  en: {
    pageTitle: "Integrations",
    pageSubtitle: "Connect your site with third-party services.",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Settings saved!",
    toastSuccessDescription: "Your integrations have been updated.",
    apiKeyLabel: "API Key",
    apiKeyPlaceholder: "Enter your API Key",
    integrations: {
      stripe: { name: 'Stripe', description: 'Accept credit card payments securely worldwide.' },
      mercadopago: { name: 'Mercado Pago', description: 'Process local payments in Latin America with the most popular options.' },
      aiagent: { name: 'AI Agent', description: 'Automate customer service with a smart virtual assistant.' },
    }
  },
  fr: {
    pageTitle: "Intégrations",
    pageSubtitle: "Connectez votre site à des services tiers.",
    saveChanges: "Enregistrer les Modifications",
    toastSuccessTitle: "Paramètres enregistrés !",
    toastSuccessDescription: "Vos intégrations ont été mises à jour.",
    apiKeyLabel: "Clé API",
    apiKeyPlaceholder: "Entrez votre clé API",
    integrations: {
      stripe: { name: 'Stripe', description: 'Acceptez les paiements par carte de crédit en toute sécurité dans le monde entier.' },
      mercadopago: { name: 'Mercado Pago', description: 'Traitez les paiements locaux en Amérique latine avec les options les plus populaires.' },
      aiagent: { name: 'Agent IA', description: 'Automatisez le service client avec un assistant virtuel intelligent.' },
    }
  }
};


type IntegrationId = 'stripe' | 'mercadopago' | 'aiagent';

type Integration = {
    id: IntegrationId;
    enabled: boolean;
    apiKey: string;
    icon: React.ReactNode;
};

const initialIntegrations: Integration[] = [
    { id: 'stripe', enabled: false, apiKey: '', icon: <DollarSign /> },
    { id: 'mercadopago', enabled: false, apiKey: '', icon: <Image src="https://picsum.photos/32/32" width={24} height={24} alt="Mercado Pago" data-ai-hint="payment processor" /> },
    { id: 'aiagent', enabled: true, apiKey: '********', icon: <Bot /> },
];


export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const handleToggle = (id: Integration['id']) => {
        setIntegrations(prev => prev.map(int => int.id === id ? { ...int, enabled: !int.enabled } : int));
    };

    const handleApiKeyChange = (id: Integration['id'], value: string) => {
        setIntegrations(prev => prev.map(int => int.id === id ? { ...int, apiKey: value } : int));
    };

    const saveChanges = () => {
        console.log('Saving integrations:', integrations);
        toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
                <p className="text-muted-foreground">{t.pageSubtitle}</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {integrations.map(integration => {
                    const intl = t.integrations[integration.id];
                    return (
                        <Card key={integration.id}>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="text-accent">{integration.icon}</div>
                                    <CardTitle>{intl.name}</CardTitle>
                                    <Switch
                                        className="ml-auto"
                                        checked={integration.enabled}
                                        onCheckedChange={() => handleToggle(integration.id)}
                                        aria-label={`Enable ${intl.name}`}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">{intl.description}</p>
                                <fieldset disabled={!integration.enabled} className="space-y-2">
                                    <Label htmlFor={`apikey-${integration.id}`}>{t.apiKeyLabel}</Label>
                                    <Input 
                                        id={`apikey-${integration.id}`}
                                        type="password"
                                        placeholder={t.apiKeyPlaceholder}
                                        value={integration.apiKey}
                                        onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                                    />
                                </fieldset>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="flex justify-end">
                <Button onClick={saveChanges}>{t.saveChanges}</Button>
            </div>
        </div>
    );
}
