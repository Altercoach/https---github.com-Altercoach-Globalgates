
'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, BrainCircuit, Upload, User, ShieldOff, KeyRound, MessageSquare, Linkedin, Twitter, Link as LinkIcon, Copy } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { useSite } from '@/hooks/use-site';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const labels = {
  es: {
    pageTitle: "Configuración del Agente de IA",
    pageSubtitle: "Define la identidad, el cerebro y la personalidad de tu asistente virtual.",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Agente guardado!",
    toastSuccessDescription: "La configuración de tu agente de IA ha sido actualizada.",
    agentProfileTitle: "Identidad del Agente",
    agentProfileDesc: "Dale un nombre y un rostro a tu agente para una interacción más humana.",
    agentFirstName: "Nombre",
    agentLastName: "Apellido",
    agentAvatar: "Foto de Perfil",
    agentGender: "Género",
    genderMale: "Hombre",
    genderFemale: "Mujer",
    agentStatus: "Estado del Agente",
    agentActive: "Activo",
    agentInactive: "Inactivo",
    systemPrompt: "Prompt del Sistema (Cerebro y Reglas)",
    systemPromptDesc: "Define el rol, reglas y cómo debe comportarse. La IA lo usará como su instrucción principal.",
    knowledgeBase: "Base de Conocimiento (Entrenamiento)",
    knowledgeBaseDesc: "Pega aquí URLs, FAQs, o cualquier información que el agente deba conocer como su 'memoria'.",
    integrations: "Claves de API de Canales",
    integrationsDesc: "Conecta tu agente a las APIs de mensajería para que pueda operar. Estas claves son para el uso interno de tu agencia.",
    whatsappApiKey: "WhatsApp API Key",
    instagramApiKey: "Instagram API Key",
    messengerApiKey: "Facebook Messenger API Key",
    linkedinApiKey: "LinkedIn API Key",
    twitterApiKey: "X (Twitter) API Key",
    supportEmail: "Email de Soporte/Ventas",
    exclusionTitle: "Reglas de Exclusión",
    exclusionDesc: "Añade emails o teléfonos (uno por línea) de contactos que el agente NUNCA debe atender (ej. proveedores, familia).",
    shareAgentTitle: "Compartir Agente",
    shareAgentDesc: "Usa esta URL para una página de chat dedicada o pega el código embed en tu sitio web.",
    shareUrl: "URL del Agente",
    embedCode: "Código de Inserción (Embed)",
    copy: "Copiar",
    copied: "¡Copiado!",
  },
  en: {
    pageTitle: "AI Agent Configuration",
    pageSubtitle: "Define the identity, brain, and personality of your virtual assistant.",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Agent saved!",
    toastSuccessDescription: "Your AI agent's configuration has been updated.",
    agentProfileTitle: "Agent Identity",
    agentProfileDesc: "Give your agent a name and a face for a more human-like interaction.",
    agentFirstName: "First Name",
    agentLastName: "Last Name",
    agentAvatar: "Profile Picture",
    agentGender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    agentStatus: "Agent Status",
    agentActive: "Active",
    agentInactive: "Inactive",
    systemPrompt: "System Prompt (Brain & Rules)",
    systemPromptDesc: "It defines its role, rules, and how it should behave. The AI will use this as its main instruction.",
    knowledgeBase: "Knowledge Base (Training)",
    knowledgeBaseDesc: "Paste URLs, FAQs, or any information the agent should know as its 'memory'.",
    integrations: "Channel API Keys",
    integrationsDesc: "Connect your agent to messaging APIs so it can operate. These keys are for your agency's internal use.",
    whatsappApiKey: "WhatsApp API Key",
    instagramApiKey: "Instagram API Key",
    messengerApiKey: "Facebook Messenger API Key",
    linkedinApiKey: "LinkedIn API Key",
    twitterApiKey: "X (Twitter) API Key",
    supportEmail: "Support/Sales Email",
    exclusionTitle: "Exclusion Rules",
    exclusionDesc: "Add emails or phone numbers (one per line) of contacts the agent should NEVER attend to (e.g., suppliers, family).",
    shareAgentTitle: "Share Agent",
    shareAgentDesc: "Use this URL for a dedicated chat page or paste the embed code on your website.",
    shareUrl: "Agent URL",
    embedCode: "Embed Code",
    copy: "Copy",
    copied: "Copied!",
  },
  fr: {
    pageTitle: "Configuration de l'Agent IA",
    pageSubtitle: "Définissez l'identité, le cerveau et la personnalité de votre assistant virtuel.",
    saveChanges: "Enregistrer les modifications",
    toastSuccessTitle: "Agent enregistré !",
    toastSuccessDescription: "La configuration de votre agent IA a été mise à jour.",
    agentProfileTitle: "Identité de l'Agent",
    agentProfileDesc: "Donnez un nom et un visage à votre agent pour une interaction plus humaine.",
    agentFirstName: "Prénom",
    agentLastName: "Nom de famille",
    agentAvatar: "Photo de profil",
    agentGender: "Genre",
    genderMale: "Homme",
    genderFemale: "Femme",
    agentStatus: "Statut de l'Agent",
    agentActive: "Actif",
    agentInactive: "Inactif",
    systemPrompt: "Prompt Système (Cerveau et Règles)",
    systemPromptDesc: "Définit son rôle, ses règles et son comportement. L'IA l'utilisera comme instruction principale.",
    knowledgeBase: "Base de Connaissances (Formation)",
    knowledgeBaseDesc: "Collez ici les URL, FAQ ou toute information que l'agent doit connaître comme sa 'mémoire'.",
    integrations: "Clés API des Canaux",
    integrationsDesc: "Connectez votre agent aux API de messagerie pour qu'il puisse fonctionner. Ces clés sont à l'usage interne de votre agence.",
    whatsappApiKey: "Clé API WhatsApp",
    instagramApiKey: "Clé API Instagram",
    messengerApiKey: "Clé API Facebook Messenger",
    linkedinApiKey: "Clé API LinkedIn",
    twitterApiKey: "Clé API X (Twitter)",
    supportEmail: "Email de Support/Ventes",
    exclusionTitle: "Règles d'Exclusion",
    exclusionDesc: "Ajoutez les e-mails ou numéros de téléphone (un par ligne) des contacts que l'agent ne doit JAMAIS prendre en charge (ex: fournisseurs, famille).",
    shareAgentTitle: "Partager l'Agent",
    shareAgentDesc: "Utilisez cette URL pour une page de chat dédiée ou collez le code d'intégration sur votre site web.",
    shareUrl: "URL de l'Agent",
    embedCode: "Code d'Intégration",
    copy: "Copier",
    copied: "Copié !",
  }
};

const DEFAULT_SYSTEM_PROMPT = `Eres '[Agent Name]', un asistente experto de [Brand Name]. Tu rol es ser amigable, proactivo y muy eficiente.
OBJETIVO: Convertir visitantes en leads calificados y resolver dudas de primer nivel.
REGLAS:
1. SIEMPRE pide nombre, email y telefono para registrar un lead.
2. NUNCA ofrezcas descuentos a menos que se indique en la BASE DE CONOCIMIENTO.
3. Si no sabes una respuesta, di: "Excelente pregunta. Permiteme consultarlo con un especialista para darte la informacion precisa. ¿Me das tu correo para contactarte?". Y registra el lead. Para escalar, usa el correo: [Support Email].
4. NUNCA te refieras a ti mismo como una IA. Eres un miembro del equipo. Para escalar, usa frases como "consultare con el departamento tecnico".
5. Usa la BASE DE CONOCIMIENTO como tu unica fuente de verdad.
6. NUNCA atiendas a los contactos en la LISTA DE EXCLUSION. Si te contactan, responde: "¡Hola! En un momento te atiende un miembro del equipo." y no continues la conversacion.`;

const DEFAULT_KNOWLEDGE_BASE = `https://www.goldenkey.website/products
https://www.goldenkey.website/contact

Horario de atencion del equipo: Lunes a Viernes, 9am - 6pm (Hora del Pacifico).
Promocion actual: 10% de descuento en el plan 'Portal Maestro Digital' para nuevos clientes. Codigo: LAUNCH10.`;

const slugify = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export default function AgentConfigPage() {
    const { language } = useLanguage();
    const { site, setSite, setHasUnsavedChanges } = useSite();
    const { toast } = useToast();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const agentConfig = site.agentConfig ?? {
        isActive: true,
        gender: 'female' as const,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
        supportEmail: 'atencion@goldenkey.website',
        exclusionList: 'proveedor@email.com\n+1234567890',
        sharePath: '/chat',
        apiKeys: {
            whatsapp: '',
            instagram: '',
            messenger: '',
            linkedin: '',
            twitter: '',
        },
    };

    const updateAgentConfig = (partial: Omit<Partial<typeof agentConfig>, 'apiKeys'> & { apiKeys?: Partial<typeof agentConfig.apiKeys> }) => {
        setSite(prev => ({
            ...prev,
            agentConfig: {
                ...(prev.agentConfig ?? agentConfig),
                ...partial,
                apiKeys: {
                    ...(prev.agentConfig?.apiKeys ?? agentConfig.apiKeys),
                    ...(partial.apiKeys ?? {}),
                },
            },
        }));
        setHasUnsavedChanges(true);
    };

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.goldenkey.website';
    const agentSlug = useMemo(() => {
        const raw = `${site.agentPersona.firstName} ${site.agentPersona.lastName}`;
        const slug = slugify(raw);
        return slug || 'agente'
    }, [site.agentPersona.firstName, site.agentPersona.lastName]);
    const normalizedSharePath = useMemo(() => {
        const path = (agentConfig.sharePath || '/chat').trim();
        return path.startsWith('/') ? path : `/${path}`;
    }, [agentConfig.sharePath]);
    const agentUrl = `${currentOrigin}${normalizedSharePath}/${agentSlug}`;
    const embedCode = `<iframe src="${agentUrl}" width="100%" height="600" frameborder="0" loading="lazy"></iframe>`;

    
    const triggerFilePicker = () => {
        document.getElementById('avatarPicker')?.click();
    };

    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const url = event.target?.result as string;
            setSite(prev => ({ ...prev, agentPersona: { ...prev.agentPersona, avatar: url } }));
            setHasUnsavedChanges(true);
        };
        reader.readAsDataURL(file);
    };

    const handleTextChange = (field: 'firstName' | 'lastName', value: string) => {
        setSite(prev => ({
            ...prev,
            agentPersona: { ...prev.agentPersona, [field]: value }
        }));
        setHasUnsavedChanges(true);
    };

    const copyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({ title: t.copied });
    };

    const handleSave = () => {
        setHasUnsavedChanges(false);
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
                    <CardTitle className="flex items-center gap-2"><User /> {t.agentProfileTitle}</CardTitle>
                    <CardDescription>{t.agentProfileDesc}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center gap-4">
                        <Label>{t.agentAvatar}</Label>
                        <div className="relative w-32 h-32">
                           <Image 
                             src={site.agentPersona.avatar || `https://i.pravatar.cc/150?u=${site.agentPersona.firstName}`} 
                             alt="Agent Avatar" 
                             width={128}
                             height={128}
                             className="rounded-full object-cover border-4 border-muted"
                           />
                        </div>
                        <Button variant="outline" size="sm" onClick={triggerFilePicker}><Upload className="mr-2"/> Cambiar</Button>
                        <Input id="avatarPicker" type="file" accept="image/*" onChange={handleAvatarPick} className="hidden"/>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="agent-name">{t.agentFirstName}</Label>
                                <Input id="agent-name" value={site.agentPersona.firstName} onChange={(e) => handleTextChange('firstName', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agent-lastname">{t.agentLastName}</Label>
                                <Input id="agent-lastname" value={site.agentPersona.lastName} onChange={(e) => handleTextChange('lastName', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                           <Label>{t.agentGender}</Label>
                                    <RadioGroup value={agentConfig.gender} onValueChange={(value: 'male' | 'female') => updateAgentConfig({ gender: value })} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="r-female" />
                                    <Label htmlFor="r-female">{t.genderFemale}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="r-male" />
                                    <Label htmlFor="r-male">{t.genderMale}</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="agent-status" checked={agentConfig.isActive} onCheckedChange={(value) => updateAgentConfig({ isActive: value })} />
                                <Label htmlFor="agent-status">{t.agentStatus}</Label>
                            </div>
                            <p className={`text-sm font-medium ${agentConfig.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                                {agentConfig.isActive ? t.agentActive : t.agentInactive}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LinkIcon /> {t.shareAgentTitle}</CardTitle>
                    <CardDescription>{t.shareAgentDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="agent-url">{t.shareUrl}</Label>
                        <div className="flex gap-2">
                            <Input id="agent-url" readOnly value={agentUrl} />
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(agentUrl)}>
                                <Copy />
                            </Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="embed-code">{t.embedCode}</Label>
                        <div className="flex gap-2">
                            <Textarea id="embed-code" readOnly value={embedCode} rows={3} className="font-mono text-xs" />
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(embedCode)}>
                                <Copy />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BrainCircuit /> {t.systemPrompt}</CardTitle>
                        <CardDescription>{t.systemPromptDesc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={agentConfig.systemPrompt}
                            onChange={(e) => updateAgentConfig({ systemPrompt: e.target.value })}
                            rows={15}
                            className="font-mono text-xs"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> {t.knowledgeBase}</CardTitle>
                        <CardDescription>{t.knowledgeBaseDesc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={agentConfig.knowledgeBase}
                            onChange={(e) => updateAgentConfig({ knowledgeBase: e.target.value })}
                            rows={15}
                             className="font-mono text-xs"
                        />
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><KeyRound /> {t.integrations}</CardTitle>
                    <CardDescription>{t.integrationsDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp-api" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t.whatsappApiKey}</Label>
                            <Input id="whatsapp-api" type="password" value={agentConfig.apiKeys.whatsapp} onChange={(e) => updateAgentConfig({ apiKeys: { whatsapp: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram-api" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t.instagramApiKey}</Label>
                            <Input id="instagram-api" type="password" value={agentConfig.apiKeys.instagram} onChange={(e) => updateAgentConfig({ apiKeys: { instagram: e.target.value } })} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="messenger-api" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t.messengerApiKey}</Label>
                            <Input id="messenger-api" type="password" value={agentConfig.apiKeys.messenger} onChange={(e) => updateAgentConfig({ apiKeys: { messenger: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin-api" className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> {t.linkedinApiKey}</Label>
                            <Input id="linkedin-api" type="password" value={agentConfig.apiKeys.linkedin} onChange={(e) => updateAgentConfig({ apiKeys: { linkedin: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter-api" className="flex items-center gap-2"><Twitter className="h-4 w-4" /> {t.twitterApiKey}</Label>
                            <Input id="twitter-api" type="password" value={agentConfig.apiKeys.twitter} onChange={(e) => updateAgentConfig({ apiKeys: { twitter: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="support-email">{t.supportEmail}</Label>
                            <Input id="support-email" type="email" value={agentConfig.supportEmail} onChange={(e) => updateAgentConfig({ supportEmail: e.target.value })} />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldOff /> {t.exclusionTitle}</CardTitle>
                    <CardDescription>{t.exclusionDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        value={agentConfig.exclusionList}
                        onChange={(e) => updateAgentConfig({ exclusionList: e.target.value })}
                        rows={5}
                        placeholder="proveedor@email.com
+1234567890"
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave}>{t.saveChanges}</Button>
            </div>

        </div>
    );
}
