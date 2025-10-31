
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Settings, Facebook, BarChart } from 'lucide-react';
import Image from 'next/image';

type Integration = {
    id: 'facebook' | 'google';
    name: string;
    description: string;
    apiKey: string;
    icon: React.ReactNode;
};

const initialIntegrations: Integration[] = [
    { 
        id: 'facebook', 
        name: 'Facebook / Meta Ads', 
        description: 'Conecta tu cuenta de Meta Ads para obtener métricas de tus campañas.',
        apiKey: '',
        icon: <Facebook />
    },
    { 
        id: 'google', 
        name: 'Google Analytics', 
        description: 'Integra Google Analytics (GA4) para visualizar el tráfico y comportamiento.',
        apiKey: '',
        icon: <BarChart />
    },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
    const [email, setEmail] = useState('demo@cliente.com');
    const [password, setPassword] = useState('');

    const handleApiKeyChange = (id: Integration['id'], value: string) => {
        setIntegrations(prev => prev.map(int => int.id === id ? { ...int, apiKey: value } : int));
    };

    const saveChanges = () => {
        toast({ title: '¡Configuración guardada!', description: 'Tus cambios han sido guardados correctamente.' });
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Configuración e Integraciones</h1>
                <p className="text-muted-foreground">Gestiona tu cuenta y conecta tus fuentes de datos.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Integraciones de Datos</CardTitle>
                    <CardDescription>
                        Introduce tus claves de API para conectar tus plataformas y ver las métricas en tu dashboard. 
                        Estos datos son confidenciales y se almacenan de forma segura.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    {integrations.map(integration => (
                        <div key={integration.id} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="text-primary">{integration.icon}</div>
                                <h3 className="font-semibold">{integration.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                             <div className="space-y-2">
                                <Label htmlFor={`apikey-${integration.id}`}>API Key / ID de Medición</Label>
                                <Input 
                                    id={`apikey-${integration.id}`}
                                    type="password"
                                    placeholder="Introduce tu clave aquí"
                                    value={integration.apiKey}
                                    onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de la Cuenta</CardTitle>
                    <CardDescription>Gestiona los detalles de tu cuenta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">Nueva Contraseña</Label>
                        <Input id="password" type="password" placeholder="Dejar en blanco para no cambiar" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={saveChanges}>Guardar Cambios</Button>
            </div>
        </div>
    );
}
