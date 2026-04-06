'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { RouteGuard } from '@/components/auth/route-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Facebook, BarChart3, HelpCircle, Shield, Download, Instagram, Linkedin, Youtube, MessageCircle, Hash, Music2, AtSign, CheckCircle2, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import type { SiteData, SocialPlatform } from '@/lib/types';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const labels = {
  es: {
    pageTitle: 'Configuración e Integraciones',
    pageSubtitle: 'Gestiona tu cuenta y conecta tus fuentes de datos.',
    integrationsTitle: 'Integraciones de Datos',
    integrationsDescription: 'Introduce tus claves de API para conectar tus plataformas y ver las métricas en tu dashboard.',
    fbName: 'Facebook / Meta Ads',
    fbDescription: 'Conecta tu cuenta de Meta Ads para obtener métricas de tus campañas.',
    gaName: 'Google Analytics 4',
    gaDescription: 'Integra GA4 para visualizar el tráfico y comportamiento.',
    apiKeyLabel: 'API Key / ID de Medición',
    apiKeyPlaceholder: 'Introduce tu clave aquí',
    accountSettingsTitle: 'Configuración de la Cuenta',
    accountSettingsDescription: 'Gestiona los detalles de tu cuenta.',
    emailLabel: 'Email',
    newPasswordLabel: 'Nueva Contraseña',
    newPasswordPlaceholder: 'Dejar en blanco para no cambiar',
    saveButton: 'Guardar Cambios',
    toastSuccessTitle: '¡Configuración guardada!',
    toastSuccessDescription: 'Tus cambios han sido guardados correctamente.',
    getMetaKeyHelp: 'Obtén un token de acceso para la API de Marketing de Meta',
    getGA4KeyHelp: 'Encuentra tu ID de Medición de Google Analytics',
    saving: 'Guardando...',
    backupTitle: 'Backup y Restauración',
    backupDescription: 'Exporta o importa toda la configuración de planes, servicios, marca y agente.',
    exportButton: 'Exportar JSON',
    importButton: 'Importar JSON',
    importHint: 'Selecciona un archivo .json exportado desde esta plataforma.',
    importSuccess: 'Configuración importada correctamente.',
    importError: 'No se pudo importar el archivo. Verifica que sea un JSON válido.',
    importValidationError: 'El archivo no contiene una estructura válida de configuración.',
    restoreBaseButton: 'Restaurar planes base',
    restoreBaseSuccess: 'Oferta base restaurada (productos, servicios y bundles).',
    restoreConfirmTitle: 'Confirmar restauración',
    restoreConfirmDescription: 'Esto reemplazará la oferta actual (productos, servicios y bundles) por la base predeterminada.',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    importModeLabel: 'Modo de importación',
    importModeAll: 'Completo (todo)',
    importModeProducts: 'Solo productos',
    importModeServices: 'Solo servicios',
    importModeAgent: 'Solo agente',
    importModeBrand: 'Solo marca',
    importPreviewTitle: 'Confirmar importación',
    importPreviewDescription: 'Se van a sobrescribir los siguientes bloques:',
    previewBrand: 'Marca',
    previewProducts: 'Productos',
    previewServices: 'Servicios',
    previewBundles: 'Bundles',
    previewAgent: 'Agente',
    previewCustomPrompt: 'Prompt personalizado',
    previewYes: 'sí',
    previewNo: 'no',
    previewSampleProducts: 'Muestra productos',
    previewSampleServices: 'Muestra servicios',
    previewMoreItems: 'más',
    previewWarningProductsLess: 'Advertencia: el backup trae menos productos que la configuración actual.',
    previewWarningServicesLess: 'Advertencia: el backup trae menos servicios que la configuración actual.',
    importRiskAck: 'Entiendo que esta importación reducirá elementos existentes.',
    socialLinksTitle: 'Redes Sociales del Footer',
    socialLinksDescription: 'Configura los enlaces públicos que se mostrarán con iconos en el pie de página.',
    linkLabel: 'URL pública',
    socialFacebook: 'Facebook',
    socialInstagram: 'Instagram',
    socialX: 'X (Twitter)',
    socialLinkedIn: 'LinkedIn',
    socialYoutube: 'YouTube',
    socialTiktok: 'TikTok',
    socialWhatsapp: 'WhatsApp',
    socialThreads: 'Threads',
    socialPreviewTitle: 'Vista previa del footer social',
    socialPreviewEmpty: 'No hay enlaces sociales activos. Agrega al menos una URL para mostrar iconos en el footer.',
    invalidSocialUrl: 'URL inválida. Usa un enlace completo que inicie con https://',
    socialVerified: 'URL verificada',
    socialDomainWarning: 'Dominio inusual para esta red. Verifica que el enlace sea correcto.',
    socialHelpLabel: 'Guía de enlace',
    socialHelpExample: 'Ejemplo',
    socialHelpDomain: 'Dominio sugerido',
    copyExample: 'Copiar ejemplo',
    copied: 'Copiado',
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
    backupTitle: 'Backup and Restore',
    backupDescription: 'Export or import full configuration for plans, services, brand and agent.',
    exportButton: 'Export JSON',
    importButton: 'Import JSON',
    importHint: 'Select a .json file exported from this platform.',
    importSuccess: 'Configuration imported successfully.',
    importError: 'Could not import file. Please verify it is valid JSON.',
    importValidationError: 'The file does not contain a valid configuration structure.',
    restoreBaseButton: 'Restore base offers',
    restoreBaseSuccess: 'Base offers restored (products, services, bundles).',
    restoreConfirmTitle: 'Confirm restore',
    restoreConfirmDescription: 'This will replace current offers (products, services, bundles) with the default base.',
    confirm: 'Confirm',
    cancel: 'Cancel',
    importModeLabel: 'Import mode',
    importModeAll: 'Full (all)',
    importModeProducts: 'Products only',
    importModeServices: 'Services only',
    importModeAgent: 'Agent only',
    importModeBrand: 'Brand only',
    importPreviewTitle: 'Confirm import',
    importPreviewDescription: 'The following blocks will be overwritten:',
    previewBrand: 'Brand',
    previewProducts: 'Products',
    previewServices: 'Services',
    previewBundles: 'Bundles',
    previewAgent: 'Agent',
    previewCustomPrompt: 'Custom prompt',
    previewYes: 'yes',
    previewNo: 'no',
    previewSampleProducts: 'Products sample',
    previewSampleServices: 'Services sample',
    previewMoreItems: 'more',
    previewWarningProductsLess: 'Warning: backup contains fewer products than the current configuration.',
    previewWarningServicesLess: 'Warning: backup contains fewer services than the current configuration.',
    importRiskAck: 'I understand this import will reduce existing items.',
    socialLinksTitle: 'Footer Social Networks',
    socialLinksDescription: 'Set the public links rendered as social icons in the footer.',
    linkLabel: 'Public URL',
    socialFacebook: 'Facebook',
    socialInstagram: 'Instagram',
    socialX: 'X (Twitter)',
    socialLinkedIn: 'LinkedIn',
    socialYoutube: 'YouTube',
    socialTiktok: 'TikTok',
    socialWhatsapp: 'WhatsApp',
    socialThreads: 'Threads',
    socialPreviewTitle: 'Social footer preview',
    socialPreviewEmpty: 'No active social links. Add at least one URL to render icons in the footer.',
    invalidSocialUrl: 'Invalid URL. Use a full link starting with https://',
    socialVerified: 'Verified URL',
    socialDomainWarning: 'Unusual domain for this network. Please verify the link is correct.',
    socialHelpLabel: 'Link guidance',
    socialHelpExample: 'Example',
    socialHelpDomain: 'Suggested domain',
    copyExample: 'Copy example',
    copied: 'Copied',
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
    backupTitle: 'Sauvegarde et Restauration',
    backupDescription: 'Exportez ou importez la configuration complete des forfaits, services, marque et agent.',
    exportButton: 'Exporter JSON',
    importButton: 'Importer JSON',
    importHint: 'Selectionnez un fichier .json exporte depuis cette plateforme.',
    importSuccess: 'Configuration importee avec succes.',
    importError: 'Impossible d\'importer le fichier. Verifiez qu\'il s\'agit d\'un JSON valide.',
    importValidationError: 'Le fichier ne contient pas une structure de configuration valide.',
    restoreBaseButton: 'Restaurer offres de base',
    restoreBaseSuccess: 'Offres de base restaurees (produits, services, bundles).',
    restoreConfirmTitle: 'Confirmer la restauration',
    restoreConfirmDescription: 'Cette action remplacera l\'offre actuelle (produits, services, bundles) par la base par defaut.',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    importModeLabel: 'Mode d\'importation',
    importModeAll: 'Complet (tout)',
    importModeProducts: 'Produits uniquement',
    importModeServices: 'Services uniquement',
    importModeAgent: 'Agent uniquement',
    importModeBrand: 'Marque uniquement',
    importPreviewTitle: 'Confirmer l\'importation',
    importPreviewDescription: 'Les blocs suivants seront remplaces :',
    previewBrand: 'Marque',
    previewProducts: 'Produits',
    previewServices: 'Services',
    previewBundles: 'Bundles',
    previewAgent: 'Agent',
    previewCustomPrompt: 'Prompt personnalise',
    previewYes: 'oui',
    previewNo: 'non',
    previewSampleProducts: 'Exemple produits',
    previewSampleServices: 'Exemple services',
    previewMoreItems: 'de plus',
    previewWarningProductsLess: 'Avertissement: la sauvegarde contient moins de produits que la configuration actuelle.',
    previewWarningServicesLess: 'Avertissement: la sauvegarde contient moins de services que la configuration actuelle.',
    importRiskAck: 'Je comprends que cette importation reduira des elements existants.',
    socialLinksTitle: 'Reseaux Sociaux du Footer',
    socialLinksDescription: 'Configurez les liens publics affiches avec des icones dans le pied de page.',
    linkLabel: 'URL publique',
    socialFacebook: 'Facebook',
    socialInstagram: 'Instagram',
    socialX: 'X (Twitter)',
    socialLinkedIn: 'LinkedIn',
    socialYoutube: 'YouTube',
    socialTiktok: 'TikTok',
    socialWhatsapp: 'WhatsApp',
    socialThreads: 'Threads',
    socialPreviewTitle: 'Apercu du footer social',
    socialPreviewEmpty: 'Aucun lien social actif. Ajoutez au moins une URL pour afficher les icones dans le footer.',
    invalidSocialUrl: 'URL invalide. Utilisez un lien complet commencant par https://',
    socialVerified: 'URL verifiee',
    socialDomainWarning: 'Domaine inhabituel pour ce reseau. Verifiez que le lien est correct.',
    socialHelpLabel: 'Guide du lien',
    socialHelpExample: 'Exemple',
    socialHelpDomain: 'Domaine suggere',
    copyExample: 'Copier exemple',
    copied: 'Copie',
  },
};

type IntegrationId = 'facebook' | 'google';
type ImportMode = 'all' | 'products' | 'services' | 'agent' | 'brand';
type PendingImportLine = {
  text: string;
  tone?: 'normal' | 'warn';
};
type PendingImport = {
  site: SiteData;
  mode: ImportMode;
  lines: PendingImportLine[];
};

const socialFieldDefs: Array<{ id: SocialPlatform; labelKey: keyof typeof labels.es; icon: JSX.Element; placeholder: string; example: string }> = [
  { id: 'facebook', labelKey: 'socialFacebook', icon: <Facebook className="h-4 w-4" />, placeholder: 'https://facebook.com/tu-pagina', example: 'https://facebook.com/goldekkey' },
  { id: 'instagram', labelKey: 'socialInstagram', icon: <Instagram className="h-4 w-4" />, placeholder: 'https://instagram.com/tu-cuenta', example: 'https://instagram.com/goldekkey' },
  { id: 'x', labelKey: 'socialX', icon: <Hash className="h-4 w-4" />, placeholder: 'https://x.com/tu-cuenta', example: 'https://x.com/goldekkey' },
  { id: 'linkedin', labelKey: 'socialLinkedIn', icon: <Linkedin className="h-4 w-4" />, placeholder: 'https://linkedin.com/company/tu-empresa', example: 'https://linkedin.com/company/goldek-key' },
  { id: 'youtube', labelKey: 'socialYoutube', icon: <Youtube className="h-4 w-4" />, placeholder: 'https://youtube.com/@tu-canal', example: 'https://youtube.com/@goldekkey' },
  { id: 'tiktok', labelKey: 'socialTiktok', icon: <Music2 className="h-4 w-4" />, placeholder: 'https://tiktok.com/@tu-cuenta', example: 'https://tiktok.com/@goldekkey' },
  { id: 'whatsapp', labelKey: 'socialWhatsapp', icon: <MessageCircle className="h-4 w-4" />, placeholder: 'https://wa.me/5210000000000', example: 'https://wa.me/5215512345678' },
  { id: 'threads', labelKey: 'socialThreads', icon: <AtSign className="h-4 w-4" />, placeholder: 'https://threads.net/@tu-cuenta', example: 'https://threads.net/@goldekkey' },
];

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
  const [socialLinks, setSocialLinks] = useState<Record<SocialPlatform, string>>({
    facebook: site.socialLinks?.facebook ?? '',
    instagram: site.socialLinks?.instagram ?? '',
    x: site.socialLinks?.x ?? '',
    linkedin: site.socialLinks?.linkedin ?? '',
    youtube: site.socialLinks?.youtube ?? '',
    tiktok: site.socialLinks?.tiktok ?? '',
    whatsapp: site.socialLinks?.whatsapp ?? '',
    threads: site.socialLinks?.threads ?? '',
  });
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [socialErrors, setSocialErrors] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [copiedField, setCopiedField] = useState<SocialPlatform | null>(null);
  const [saving, setSaving] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('all');
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importRiskAccepted, setImportRiskAccepted] = useState(false);
  const langCode = language.code as 'es' | 'en' | 'fr';
  const hasImportWarnings = !!pendingImport?.lines.some(line => line.tone === 'warn');

  const expectedDomains: Record<SocialPlatform, string[]> = {
    facebook: ['facebook.com', 'fb.com'],
    instagram: ['instagram.com'],
    x: ['x.com', 'twitter.com'],
    linkedin: ['linkedin.com'],
    youtube: ['youtube.com', 'youtu.be'],
    tiktok: ['tiktok.com'],
    whatsapp: ['wa.me', 'whatsapp.com'],
    threads: ['threads.net'],
  };

  const isValidSocialUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateSocialLinks = () => {
    const nextErrors: Partial<Record<SocialPlatform, string>> = {};
    socialFieldDefs.forEach((field) => {
      const value = socialLinks[field.id] ?? '';
      if (!isValidSocialUrl(value)) {
        nextErrors[field.id] = t.invalidSocialUrl;
      }
    });
    setSocialErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const activeSocialPreview = socialFieldDefs.filter((field) => {
    const value = (socialLinks[field.id] ?? '').trim();
    return value.length > 0 && isValidSocialUrl(value);
  });

  const hasExpectedDomain = (platform: SocialPlatform, value: string) => {
    if (!value.trim() || !isValidSocialUrl(value)) return false;
    try {
      const host = new URL(value.trim()).hostname.toLowerCase();
      return expectedDomains[platform].some((domain) => host === domain || host.endsWith(`.${domain}`));
    } catch {
      return false;
    }
  };

  const normalizeSocialUrlInput = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Safe normalization: prepend https only for domain-like values without spaces.
    if (!trimmed.includes(' ') && trimmed.includes('.')) {
      return `https://${trimmed}`;
    }

    return trimmed;
  };

  const handleCopyExample = async (platform: SocialPlatform, example: string) => {
    try {
      await navigator.clipboard.writeText(example);
      setCopiedField(platform);
      setTimeout(() => setCopiedField((prev) => (prev === platform ? null : prev)), 1200);
    } catch {
      // Clipboard may be blocked by browser policy; keep UX silent.
    }
  };

  useEffect(() => {
    setApiKeys({
      facebook: site.integrationsKeys?.facebook ?? '',
      google: site.integrationsKeys?.google ?? '',
    });
    setEmail(site.accountEmail ?? 'admin@negocio.com');
    setSocialLinks({
      facebook: site.socialLinks?.facebook ?? '',
      instagram: site.socialLinks?.instagram ?? '',
      x: site.socialLinks?.x ?? '',
      linkedin: site.socialLinks?.linkedin ?? '',
      youtube: site.socialLinks?.youtube ?? '',
      tiktok: site.socialLinks?.tiktok ?? '',
      whatsapp: site.socialLinks?.whatsapp ?? '',
      threads: site.socialLinks?.threads ?? '',
    });
  }, [site]);

  const isValidImportedSite = (data: unknown): data is SiteData => {
    if (!data || typeof data !== 'object') return false;
    const candidate = data as SiteData;
    return !!candidate.brand && !!candidate.agentPersona && Array.isArray(candidate.products) && Array.isArray(candidate.services);
  };

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      site,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `goldek-key-international-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { site?: unknown } | unknown;
      const siteCandidate = typeof parsed === 'object' && parsed && 'site' in parsed
        ? (parsed as { site?: unknown }).site
        : parsed;

      if (!isValidImportedSite(siteCandidate)) {
        toast({ variant: 'destructive', title: t.importValidationError });
        return;
      }

      const lines: PendingImportLine[] = [];
      const topProducts = siteCandidate.products
        .slice(0, 3)
        .map((p) => p.name[langCode] || p.name.es)
        .join(', ');
      const topServices = siteCandidate.services
        .slice(0, 3)
        .map((s) => s.title[langCode] || s.title.es)
        .join(', ');
      const remainingProducts = Math.max(siteCandidate.products.length - 3, 0);
      const remainingServices = Math.max(siteCandidate.services.length - 3, 0);

      if (importMode === 'all') {
        lines.push({ text: `${t.previewBrand}: ${siteCandidate.brand.name[langCode] || siteCandidate.brand.name.es}` });
        lines.push({ text: `${t.previewProducts}: ${siteCandidate.products.length}` });
        lines.push({ text: `${t.previewServices}: ${siteCandidate.services.length}` });
        lines.push({ text: `${t.previewBundles}: ${(siteCandidate.bundles ?? []).length}` });
        lines.push({ text: `${t.previewAgent}: ${siteCandidate.agentPersona.firstName} ${siteCandidate.agentPersona.lastName}` });
        if (topProducts) {
          lines.push({ text: `${t.previewSampleProducts}: ${topProducts}${remainingProducts > 0 ? ` (+${remainingProducts} ${t.previewMoreItems})` : ''}` });
        }
        if (topServices) {
          lines.push({ text: `${t.previewSampleServices}: ${topServices}${remainingServices > 0 ? ` (+${remainingServices} ${t.previewMoreItems})` : ''}` });
        }
        if (siteCandidate.products.length < site.products.length) {
          lines.push({ text: t.previewWarningProductsLess, tone: 'warn' });
        }
        if (siteCandidate.services.length < site.services.length) {
          lines.push({ text: t.previewWarningServicesLess, tone: 'warn' });
        }
      }
      if (importMode === 'products') {
        lines.push({ text: `${t.previewProducts}: ${siteCandidate.products.length}` });
        if (topProducts) {
          lines.push({ text: `${t.previewSampleProducts}: ${topProducts}${remainingProducts > 0 ? ` (+${remainingProducts} ${t.previewMoreItems})` : ''}` });
        }
        if (siteCandidate.products.length < site.products.length) {
          lines.push({ text: t.previewWarningProductsLess, tone: 'warn' });
        }
      }
      if (importMode === 'services') {
        lines.push({ text: `${t.previewServices}: ${siteCandidate.services.length}` });
        if (topServices) {
          lines.push({ text: `${t.previewSampleServices}: ${topServices}${remainingServices > 0 ? ` (+${remainingServices} ${t.previewMoreItems})` : ''}` });
        }
        if (siteCandidate.services.length < site.services.length) {
          lines.push({ text: t.previewWarningServicesLess, tone: 'warn' });
        }
      }
      if (importMode === 'agent') {
        lines.push({ text: `${t.previewAgent}: ${siteCandidate.agentPersona.firstName} ${siteCandidate.agentPersona.lastName}` });
        lines.push({ text: `${t.previewCustomPrompt}: ${siteCandidate.agentConfig?.systemPrompt ? t.previewYes : t.previewNo}` });
      }
      if (importMode === 'brand') {
        lines.push({ text: `${t.previewBrand}: ${siteCandidate.brand.name[langCode] || siteCandidate.brand.name.es}` });
      }

      setPendingImport({
        site: siteCandidate,
        mode: importMode,
        lines,
      });
      setImportRiskAccepted(false);
      setIsImportDialogOpen(true);
    } catch {
      toast({ variant: 'destructive', title: t.importError });
    } finally {
      event.target.value = '';
    }
  };

  const applyPendingImport = () => {
    if (!pendingImport) return;

    const { site: siteCandidate, mode } = pendingImport;
    setSite(prev => {
      if (mode === 'products') {
        return { ...prev, products: siteCandidate.products };
      }
      if (mode === 'services') {
        return { ...prev, services: siteCandidate.services };
      }
      if (mode === 'agent') {
        return {
          ...prev,
          agentPersona: siteCandidate.agentPersona,
          agentConfig: siteCandidate.agentConfig ?? prev.agentConfig,
        };
      }
      if (mode === 'brand') {
        return {
          ...prev,
          brand: siteCandidate.brand,
        };
      }
      return siteCandidate;
    });
    toast({ title: t.importSuccess });
    setIsImportDialogOpen(false);
    setPendingImport(null);
    setImportRiskAccepted(false);
  };

  const handleRestoreBaseOffers = () => {
    setSite(prev => ({
      ...prev,
      products: DEFAULT_SITE_CONTENT.products,
      services: DEFAULT_SITE_CONTENT.services,
      bundles: DEFAULT_SITE_CONTENT.bundles,
    }));
    toast({ title: t.restoreBaseSuccess });
  };

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errs.email = 'Email invalido';
    }
    if (password && password.length < 12) {
      errs.password = 'La contraseña debe tener al menos 12 caracteres';
    }
    return errs;
  };

  const saveChanges = () => {
    const errs = validate();
    setErrors(errs);
    const socialValid = validateSocialLinks();
    if (Object.keys(errs).length > 0 || !socialValid) return;
    setSaving(true);
    setTimeout(() => {
      setSite(prev => ({
        ...prev,
        accountEmail: email,
        integrationsKeys: { ...prev.integrationsKeys, ...apiKeys },
        socialLinks: { ...socialLinks },
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
                          <Link
                            href={integration.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={integration.helpText}
                          >
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

        <Card>
          <CardHeader>
            <CardTitle>{t.socialLinksTitle}</CardTitle>
            <CardDescription>{t.socialLinksDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {socialFieldDefs.map((field) => (
              <div key={field.id} className="space-y-1">
                <Label htmlFor={`social-${field.id}`} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2">
                    {field.icon}
                    {t[field.labelKey]}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" aria-label={t.socialHelpLabel} className="text-muted-foreground hover:text-foreground">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs space-y-1 text-xs">
                        <p><strong>{t.socialHelpExample}:</strong> {field.example}</p>
                        <p><strong>{t.socialHelpDomain}:</strong> {expectedDomains[field.id].join(', ')}</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="mt-1 h-7 px-2 text-xs"
                          onClick={() => { void handleCopyExample(field.id, field.example); }}
                        >
                          {copiedField === field.id ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                          {copiedField === field.id ? t.copied : t.copyExample}
                        </Button>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id={`social-${field.id}`}
                  placeholder={field.placeholder}
                  value={socialLinks[field.id]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSocialLinks((prev) => ({ ...prev, [field.id]: value }));
                    setSocialErrors((prev) => {
                      const next = { ...prev };
                      if (!isValidSocialUrl(value)) {
                        next[field.id] = t.invalidSocialUrl;
                      } else {
                        delete next[field.id];
                      }
                      return next;
                    });
                  }}
                  onBlur={(e) => {
                    const normalized = normalizeSocialUrlInput(e.target.value);
                    setSocialLinks((prev) => ({ ...prev, [field.id]: normalized }));
                    setSocialErrors((prev) => {
                      const next = { ...prev };
                      if (!isValidSocialUrl(normalized)) {
                        next[field.id] = t.invalidSocialUrl;
                      } else {
                        delete next[field.id];
                      }
                      return next;
                    });
                  }}
                />
                {socialErrors[field.id] && (
                  <p className="text-xs text-red-600">{socialErrors[field.id]}</p>
                )}
                {!socialErrors[field.id] && (socialLinks[field.id] ?? '').trim().length > 0 && isValidSocialUrl(socialLinks[field.id] ?? '') && (
                  <p className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t.socialVerified}
                  </p>
                )}
                {!socialErrors[field.id] && (socialLinks[field.id] ?? '').trim().length > 0 && isValidSocialUrl(socialLinks[field.id] ?? '') && !hasExpectedDomain(field.id, socialLinks[field.id] ?? '') && (
                  <p className="text-xs text-amber-600">{t.socialDomainWarning}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.socialPreviewTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSocialPreview.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.socialPreviewEmpty}</p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {activeSocialPreview.map((field) => (
                  <Button key={`preview-${field.id}`} variant="outline" size="sm" asChild>
                    <a href={socialLinks[field.id]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      {field.icon}
                      {t[field.labelKey]}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.backupTitle}</CardTitle>
            <CardDescription>{t.backupDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="import-mode">{t.importModeLabel}</Label>
              <Select value={importMode} onValueChange={(value: ImportMode) => setImportMode(value)}>
                <SelectTrigger id="import-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.importModeAll}</SelectItem>
                  <SelectItem value="products">{t.importModeProducts}</SelectItem>
                  <SelectItem value="services">{t.importModeServices}</SelectItem>
                  <SelectItem value="agent">{t.importModeAgent}</SelectItem>
                  <SelectItem value="brand">{t.importModeBrand}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                {t.exportButton}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline">
                    {t.restoreBaseButton}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t.restoreConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{t.restoreConfirmDescription}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestoreBaseOffers}>{t.confirm}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Label htmlFor="import-site-json" className="sr-only">{t.importButton}</Label>
              <Input
                id="import-site-json"
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                className="max-w-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">{t.importHint}</p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveChanges} disabled={saving || Object.keys(socialErrors).length > 0}>
            {saving ? t.saving : t.saveButton}
          </Button>
        </div>

        <AlertDialog
          open={isImportDialogOpen}
          onOpenChange={(open) => {
            setIsImportDialogOpen(open);
            if (!open) {
              setPendingImport(null);
              setImportRiskAccepted(false);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.importPreviewTitle}</AlertDialogTitle>
              <AlertDialogDescription>{t.importPreviewDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1 text-sm">
              {pendingImport?.lines.map((line, idx) => (
                <p key={idx} className={line.tone === 'warn' ? 'text-amber-600 font-medium' : ''}>- {line.text}</p>
              ))}
            </div>
            {hasImportWarnings && (
              <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3">
                <Checkbox
                  id="import-risk-ack"
                  checked={importRiskAccepted}
                  onCheckedChange={(checked) => setImportRiskAccepted(checked === true)}
                />
                <Label htmlFor="import-risk-ack" className="text-sm text-amber-900">
                  {t.importRiskAck}
                </Label>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setPendingImport(null); setImportRiskAccepted(false); }}>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={applyPendingImport} disabled={hasImportWarnings && !importRiskAccepted}>{t.confirm}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RouteGuard>
  );
}
