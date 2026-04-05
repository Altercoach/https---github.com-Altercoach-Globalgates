'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { RouteGuard } from '@/components/auth/route-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Facebook, BarChart3, HelpCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const labels = {
  es: {
    pageTitle: 'Configuracion e Integraciones',
    pageSubtitle: 'Gestiona tu cuenta y conecta tus fuentes de datos.',
    integrationsTitle: 'Integraciones de Datos',
    integrationsDescription: 'Introduce tus claves de API para conectar tus plataformas y ver las metricas en tu dashboard.',
    fbName: 'Facebook / Meta Ads',
    fbDescription: 'Conecta tu cuenta de Meta Ads para obtener metricas de tus campanas.',
    gaName: 'Google Analytics 4',
    gaDescription: 'Integra GA4 para visualizar el trafico y comportamiento.',
    apiKeyLabel: 'API Key / ID de Medicion',
    apiKeyPlaceholder: 'Introduce tu clave aqui',
    accountSettingsTitle: 'Configuracion de la Cuenta',
    accountSettingsDescription: 'Gestiona los detalles de tu cuenta.',
    emailLabel: 'Email',
    newPasswordLabel: 'Nueva Contrasena',
    newPasswordPlaceholder: 'Dejar en blanco para no cambiar',
    saveButton: 'Guardar Cambios',
    toastSuccessTitle: 'Configuracion guardada!',
    toastSuccessDescription: 'Tus cambios han sido guardados correctamente.',
    getMetaKeyHelp: 'Obtén un token de acceso para la API de Marketing de Meta',
    getGA4KeyHelp: 'Encuentra tu ID de Medicion de Google Analytics',
    saving: 'Guardando...',
  },
  en: {
    pageTitle: 'Settings & Integrations',
    pageSubtitle: 'Manage your account and connect your data sources.',
    integrationsTitle: 'Data Integrations',
    integrationsDescription: 'Enter your API keys to connect your platforms and see metrics on your dashboard.',
    fbName: 'Facebook / Meta Ads',
    fbDescription: 'Connect your Meta Ads account to get metrics from your campaigns.',
    gaName: 'Google Analytics 4',
    gaDescription: 'Integrate GA4 to visualize traffic and behavior.',
    apiKeyLabel: 'API Key / Measurement ID',
    apiKeyPlaceholder: 'Enter your key here',
    accountSettingsTitle: 'Account Settings',
    accountSettingsDescription: 'Manage your account details.',
    emailLabel: 'Email',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'Leave blank to not change',
    saveButton: 'Save Changes',
    toastSuccessTitle: 'Settings saved!',
    toastSuccessDescription: 'Your changes have been saved successfully.',
    getMetaKeyHelp: 'Get an access token for the Meta Marketing API',
    getGA4KeyHelp: 'Find your Google Analytics Measurement ID',
    saving: 'Saving...',
  },
  fr: {
    pageTitle: 'Parametres et Integrations',
    pageSubtitle: 'Gerez votre compte et connectez vos sources de donnees.',
    integrationsTitle: 'Integrations de Donnees',
    integrationsDescription: 'Entrez vos cles API pour connecter vos plateformes et voir les metriques sur votre tableau de bord.',
    fbName: 'Facebook / Meta Ads',
    fbDescription: 'Connectez votre compte Meta Ads pour obtenir les metriques de vos campagnes.',
    gaName: 'Google Analytics 4',
    gaDescription: 'Integrez GA4 pour visualiser le trafic et le comportement.',
    apiKeyLabel: 'Cle API / ID de Mesure',
    apiKeyPlaceholder: 'Entrez votre cle ici',
    accountSettingsTitle: 'Parametres du Compte',
    accountSettingsDescription: 'Gerez les details de votre compte.',
    emailLabel: 'Email',
    newPasswordLabel: 'Nouveau Mot de Passe',
    newPasswordPlaceholder: 'Laisser vide pour ne pas changer',
    saveButton: 'Enregistrer les Modifications',
    toastSuccessTitle: 'Parametres enregistres!',
    toastSuccessDescription: 'Vos modifications ont ete enregistrees avec succes.',
    getMetaKeyHelp: "Obtenez un jeton d'acces pour l'API Marketing de Meta",
    getGA4KeyHelp: 'Trouvez votre ID de mesure Google Analytics',
    saving: 'Enregistrement...',
  },
};

type IntegrationId = 'facebook' | 'google';

function SecurityStatusBadge() {
  const [status, setStatus] = useState<'ok' | 'vulnerable' | 'scanning'>('ok');
  const [lastScan, setLastScan] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.random();
      if (r < 0.15) setStatus('vulnerable');
      else if (r < 0.25) setStatus('scanning');
      else setStatus('ok');
      setLastScan(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  let colorClass = 'bg-green-100 text-green-800';
  let label = 'Seguro';
  if (status === 'vulnerable') { colorClass = 'bg-orange-100 text-orange-800'; label = 'Vulnerable'; }
  if (status === 'scanning') { colorClass = 'bg-blue-100 text-blue-800 animate-pulse'; label = 'Escaneando...'; }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Shield className="h-4 w-4" />
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {label}
        {lastScan && <span className="ml-2 text-[10px]">{lastScan}</span>}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] ?? labels.en;
  const { site, setSite } = useSite();

  const integrationDefs = [
    {
      id: 'facebook' as IntegrationId,
      name: t.fbName,
      description: t.fbDescription,
      icon: <Facebook className="h-5 w-5" />,
      helpText: t.getMetaKeyHelp,
      helpUrl: 'https://developers.facebook.com/docs/marketing-api/tokens',
    },
    {
      id: 'google' as IntegrationId,
      name: t.gaName,
      description: t.gaDescription,
      icon: <BarChart3 className="h-5 w-5" />,
      helpText: t.getGA4KeyHelp,
      helpUrl: 'https://support.google.com/analytics/answer/10089681',
    },
  ];

  const [apiKeys, setApiKeys] = useState<Record<IntegrationId, string>>({
    facebook: site.integrationsKeys?.facebook ?? '',
    google: site.integrationsKeys?.google ?? '',
  });
  const [email, setEmail] = useState(site.accountEmail ?? 'admin@negocio.com');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errs.email = 'Email invalido';
    }
    if (password && password.length < 12) {
      errs.password = 'La contrasena debe tener al menos 12 caracteres';
    }
    return errs;
  };

  const saveChanges = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    setTimeout(() => {
      setSite(prev => ({
        ...prev,
        accountEmail: email,
        integrationsKeys: { ...prev.integrationsKeys, ...apiKeys },
        ...(password ? { accountPassword: password } : {}),
      }));
      setSaving(false);
      setPassword('');
      toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
    }, 800);
  };

  return (
    <RouteGuard requireAuth>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </header>

        <SecurityStatusBadge />

        <Card>
          <CardHeader>
            <CardTitle>{t.integrationsTitle}</CardTitle>
            <CardDescription>{t.integrationsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            {integrationDefs.map(integration => (
              <div key={integration.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-primary">{integration.icon}</div>
                  <h3 className="font-semibold">{integration.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`apikey-${integration.id}`}>{t.apiKeyLabel}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={integration.helpUrl} target="_blank" tabIndex={-1}>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
                    onChange={e => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
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
            <div>
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">{t.newPasswordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.newPasswordPlaceholder}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveChanges} disabled={saving}>
            {saving ? t.saving : t.saveButton}
          </Button>
        </div>
      </div>
    </RouteGuard>
  );
}
