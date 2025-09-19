
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

type Integration = {
    id: 'stripe' | 'mercadopago' | 'aiagent';
    name: string;
    description: string;
    enabled: boolean;
    apiKey: string;
    icon: React.ReactNode;
};

const initialIntegrations: Integration[] = [
    { 
        id: 'stripe', 
        name: 'Stripe', 
        description: 'Acepta pagos con tarjeta de crédito de forma segura en todo el mundo.',
        enabled: false, 
        apiKey: '',
        icon: <DollarSign />
    },
    { 
        id: 'mercadopago', 
        name: 'Mercado Pago', 
        description: 'Procesa pagos locales en Latinoamérica con las opciones más populares.',
        enabled: false, 
        apiKey: '',
        icon: <Image src="https://picsum.photos/32/32" width={24} height={24} alt="Mercado Pago" data-ai-hint="payment processor" />
    },
    { 
        id: 'aiagent', 
        name: 'Agente de IA', 
        description: 'Automatiza la atención al cliente con un asistente virtual inteligente.',
        enabled: true, 
        apiKey: '********',
        icon: <Bot />
    },
];


export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
    const { toast } = useToast();

    const handleToggle = (id: Integration['id']) => {
        setIntegrations(prev => prev.map(int => int.id === id ? { ...int, enabled: !int.enabled } : int));
    };

    const handleApiKeyChange = (id: Integration['id'], value: string) => {
        setIntegrations(prev => prev.map(int => int.id === id ? { ...int, apiKey: value } : int));
    };

    const saveChanges = () => {
        // En una app real, esto guardaría la configuración en el backend.
        console.log('Saving integrations:', integrations);
        toast({ title: '¡Configuración guardada!', description: 'Tus integraciones han sido actualizadas.' });
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Integraciones</h1>
                <p className="text-muted-foreground">Conecta tu sitio con servicios de terceros.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {integrations.map(integration => (
                    <Card key={integration.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="text-accent">{integration.icon}</div>
                                <CardTitle>{integration.name}</CardTitle>
                                <Switch
                                    className="ml-auto"
                                    checked={integration.enabled}
                                    onCheckedChange={() => handleToggle(integration.id)}
                                    aria-label={`Enable ${integration.name}`}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            <fieldset disabled={!integration.enabled} className="space-y-2">
                                <Label htmlFor={`apikey-${integration.id}`}>API Key</Label>
                                <Input 
                                    id={`apikey-${integration.id}`}
                                    type="password"
                                    placeholder="Introduce tu API Key"
                                    value={integration.apiKey}
                                    onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                                />
                            </fieldset>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button onClick={saveChanges}>Guardar Cambios</Button>
            </div>
        </div>
    );
}
