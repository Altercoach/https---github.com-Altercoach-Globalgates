'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Settings, Facebook, BarChart3, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const labels = {
  es: {
    pageTitle: "Configuración e Integraciones",
    pageSubtitle: "Gestiona tu cuenta y conecta tus fuentes de datos.",
    integrationsTitle: "Integraciones de Datos",
    integrationsDescription: "Introduce tus claves de API para conectar tus plataformas y ver las métricas en tu dashboard. Estos datos son confidenciales y se almacenan de forma segura.",
    fbName: "Facebook / Meta Ads",
    fbDescription: "Conecta tu cuenta de Meta Ads para obtener métricas de tus campañas.",
    gaName: "Google Analytics 4",
    gaDescription: "Integra GA4 para visualizar el tráfico y comportamiento.",
    apiKeyLabel: "API Key / ID de Medición",
    apiKeyPlaceholder: "Introduce tu clave aquí",
    accountSettingsTitle: "Configuración de la Cuenta",
    accountSettingsDescription: "Gestiona los detalles de tu cuenta.",
    emailLabel: "Email",
    newPasswordLabel: "Nueva Contraseña",
    newPasswordPlaceholder: "Dejar en blanco para no cambiar",
    saveButton: "Guardar Cambios",
    toastSuccessTitle: "¡Configuración guardada!",
    toastSuccessDescription: "Tus cambios han sido guardados correctamente.",
    getMetaKeyHelp: "Obtén un token de acceso para la API de Marketing de Meta",
    getGA4KeyHelp: "Encuentra tu ID de Medición de Google Analytics",
  },
  en: {
    pageTitle: "Settings & Integrations",
    pageSubtitle: "Manage your account and connect your data sources.",
    integrationsTitle: "Data Integrations",
    integrationsDescription: "Enter your API keys to connect your platforms and see metrics on your dashboard. This data is confidential and stored securely.",
    fbName: "Facebook / Meta Ads",
    fbDescription: "Connect your Meta Ads account to get metrics from your campaigns.",
    gaName: "Google Analytics 4",
    gaDescription: "Integrate GA4 to visualize traffic and behavior.",
    apiKeyLabel: "API Key / Measurement ID",
    apiKeyPlaceholder: "Enter your key here",
    accountSettingsTitle: "Account Settings",
    accountSettingsDescription: "Manage your account details.",
    emailLabel: "Email",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Leave blank to not change",
    saveButton: "Save Changes",
    toastSuccessTitle: "Settings saved!",
    toastSuccessDescription: "Your changes have been saved successfully.",
    getMetaKeyHelp: "Get an access token for the Meta Marketing API",
    getGA4KeyHelp: "Find your Google Analytics Measurement ID",
  },
  fr: {
    pageTitle: "Paramètres et Intégrations",
    pageSubtitle: "Gérez votre compte et connectez vos sources de données.",
    integrationsTitle: "Intégrations de Données",
    integrationsDescription: "Entrez vos clés API pour connecter vos plateformes et voir les métriques sur votre tableau de bord. Ces données sont confidentielles et stockées en toute sécurité.",
    fbName: "Facebook / Meta Ads",
    fbDescription: "Connectez votre compte Meta Ads pour obtenir les métriques de vos campagnes.",
    gaName: "Google Analytics 4",
    gaDescription: "Intégrez GA4 pour visualiser le trafic et le comportement.",
    apiKeyLabel: "Clé API / ID de Mesure",
    apiKeyPlaceholder: "Entrez votre clé ici",
    accountSettingsTitle: "Paramètres du Compte",
    accountSettingsDescription: "Gérez les détails de votre compte.",
    emailLabel: "Email",
    newPasswordLabel: "Nouveau Mot de Passe",
    newPasswordPlaceholder: "Laisser vide pour ne pas changer",
    saveButton: "Enregistrer les Modifications",
    toastSuccessTitle: "Paramètres enregistrés !",
    toastSuccessDescription: "Vos modifications ont été enregistrées avec succès.",
    getMetaKeyHelp: "Obtenez un jeton d'accès pour l'API Marketing de Meta",
    getGA4KeyHelp: "Trouvez votre ID de mesure Google Analytics",
  }
};


type IntegrationId = 'facebook' | 'google';

type Integration = {
    id: IntegrationId;
    name: string;
    description: string;
    apiKey: string;
    icon: React.ReactNode;
    helpText: string;
    helpUrl: string;
};

export default function SettingsPage() {
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const initialIntegrations: Omit<Integration, 'apiKey'>[] = [
        { id: 'facebook', name: t.fbName, description: t.fbDescription, icon: <Facebook />, helpText: t.getMetaKeyHelp, helpUrl: "https://developers.facebook.com/docs/marketing-api/tokens" },
        { id: 'google', name: t.gaName, description: t.gaDescription, icon: <BarChart3 />, helpText: t.getGA4KeyHelp, helpUrl: "https://support.google.com/analytics/answer/10089681" },
    ];

    const [apiKeys, setApiKeys] = useState<Record<IntegrationId, string>>({
        facebook: '',
        google: ''
    });

    const [email, setEmail] = useState('demo@cliente.com');
    const [password, setPassword] = useState('');

    const handleApiKeyChange = (id: IntegrationId, value: string) => {
        setApiKeys(prev => ({ ...prev, [id]: value }));
    };

    const saveChanges = () => {
        toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
                <p className="text-muted-foreground">{t.pageSubtitle}</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>{t.integrationsTitle}</CardTitle>
                    <CardDescription>{t.integrationsDescription}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    {initialIntegrations.map(integration => (
                        <div key={integration.id} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="text-primary">{integration.icon}</div>
                                <h3 className="font-semibold">{integration.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                             <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`apikey-${integration.id}`}>{t.apiKeyLabel}</Label>
                                  <TooltipProvider>
                                      <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Link href={integration.helpUrl} target="_blank" tabIndex={-1}>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help"/>
                                            </Link>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{integration.helpText}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <Input 
                                    id={`apikey-${integration.id}`}
                                    type="password"
                                    placeholder={t.apiKeyPlaceholder}
                                    value={apiKeys[integration.id]}
                                    onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.accountSettingsTitle}</CardTitle>
                    <CardDescription>{t.accountSettingsDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email">{t.emailLabel}</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">{t.newPasswordLabel}</Label>
                        <Input id="password" type="password" placeholder={t.newPasswordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={saveChanges}>{t.saveButton}</Button>
            </div>
        </div>
    );
}
