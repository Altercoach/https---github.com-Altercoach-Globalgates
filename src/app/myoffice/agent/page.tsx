
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Save, FileText, BrainCircuit, Upload, User, Image as ImageIcon, ShieldOff, KeyRound } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useSite } from '@/hooks/use-site';

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
    agentStatus: "Estado del Agente",
    agentActive: "Activo",
    agentInactive: "Inactivo",
    systemPrompt: "Prompt del Sistema (Cerebro y Reglas)",
    systemPromptDesc: "Define el rol, reglas y cómo debe comportarse. La IA lo usará como su instrucción principal.",
    knowledgeBase: "Base de Conocimiento (Entrenamiento)",
    knowledgeBaseDesc: "Pega aquí URLs, FAQs, o cualquier información que el agente deba conocer como su 'memoria'.",
    integrations: "Integraciones y Claves de API",
    integrationsDesc: "Conecta tu agente a las APIs de mensajería y define los correos de tu equipo.",
    whatsappApiKey: "WhatsApp API Key",
    instagramApiKey: "Instagram API Key",
    messengerApiKey: "Facebook Messenger API Key",
    supportEmail: "Email de Soporte/Ventas",
    exclusionTitle: "Reglas de Exclusión",
    exclusionDesc: "Añade emails o teléfonos (uno por línea) de contactos que el agente NUNCA debe atender (ej. proveedores, familia).",
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
    agentStatus: "Agent Status",
    agentActive: "Active",
    agentInactive: "Inactive",
    systemPrompt: "System Prompt (Brain & Rules)",
    systemPromptDesc: "It defines its role, rules, and how it should behave. The AI will use this as its main instruction.",
    knowledgeBase: "Knowledge Base (Training)",
    knowledgeBaseDesc: "Paste URLs, FAQs, or any information the agent should know as its 'memory'.",
    integrations: "Integrations & API Keys",
    integrationsDesc: "Connect your agent to messaging APIs and define your team's emails.",
    whatsappApiKey: "WhatsApp API Key",
    instagramApiKey: "Instagram API Key",
    messengerApiKey: "Facebook Messenger API Key",
    supportEmail: "Support/Sales Email",
    exclusionTitle: "Exclusion Rules",
    exclusionDesc: "Add emails or phone numbers (one per line) of contacts the agent should NEVER attend to (e.g., suppliers, family).",
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
    agentStatus: "Statut de l'Agent",
    agentActive: "Actif",
    agentInactive: "Inactif",
    systemPrompt: "Prompt Système (Cerveau et Règles)",
    systemPromptDesc: "Définit son rôle, ses règles et son comportement. L'IA l'utilisera comme instruction principale.",
    knowledgeBase: "Base de Connaissances (Formation)",
    knowledgeBaseDesc: "Collez ici les URL, FAQ ou toute information que l'agent doit connaître comme sa 'mémoire'.",
    integrations: "Intégrations & Clés API",
    integrationsDesc: "Connectez votre agent aux API de messagerie et définissez les e-mails de votre équipe.",
    whatsappApiKey: "Clé API WhatsApp",
    instagramApiKey: "Clé API Instagram",
    messengerApiKey: "Clé API Facebook Messenger",
    supportEmail: "Email de Support/Ventes",
    exclusionTitle: "Règles d'Exclusion",
    exclusionDesc: "Ajoutez les e-mails ou numéros de téléphone (un par ligne) des contacts que l'agent ne doit JAMAIS prendre en charge (ex: fournisseurs, famille).",
  }
};

const defaultSystemPrompt = `Eres '[Agent Name]', un asistente experto de Golden Key Agency. Tu rol es ser amigable, proactivo y muy eficiente.
OBJETIVO: Convertir visitantes en leads calificados y resolver dudas de primer nivel.
REGLAS:
1. SIEMPRE pide nombre, email y teléfono para registrar un lead.
2. NUNCA ofrezcas descuentos a menos que se indique en la BASE DE CONOCIMIENTO.
3. Si no sabes una respuesta, di: "Excelente pregunta. Permíteme consultarlo con un especialista para darte la información precisa. ¿Me das tu correo para contactarte?". Y registra el lead. Para escalar, usa el correo: [Support Email].
4. NUNCA te refieras a ti mismo como una IA. Eres un miembro del equipo. Para escalar, usa frases como "consultaré con el departamento técnico".
5. Usa la BASE DE CONOCIMIENTO como tu única fuente de verdad.
6. NUNCA atiendas a los contactos en la LISTA DE EXCLUSIÓN. Si te contactan, responde: "¡Hola! En un momento te atiende un miembro del equipo." y no continúes la conversación.`;

const defaultKnowledgeBase = `https://goldenkey.agency/products
https://goldenkey.agency/contact

Horario de atención del equipo: Lunes a Viernes, 9am - 6pm (Hora del Pacífico).
Promoción actual: 10% de descuento en el plan 'Portal Maestro Digital' para nuevos clientes. Código: LAUNCH10.`;


export default function AgentConfigPage() {
    const { language } = useLanguage();
    const { site, setSite, setHasUnsavedChanges } = useSite();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const [isActive, setIsActive] = useState(true);
    const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
    const [knowledgeBase, setKnowledgeBase] = useState(defaultKnowledgeBase);
    
    // States for the new fields
    const [whatsappKey, setWhatsappKey] = useState('wh_xxxxxxxx');
    const [instagramKey, setInstagramKey] = useState('ig_xxxxxxxx');
    const [messengerKey, setMessengerKey] = useState('ms_xxxxxxxx');
    const [supportEmail, setSupportEmail] = useState('atencion@goldenkey.website');
    const [exclusionList, setExclusionList] = useState('proveedor@email.com\n+1234567890');

    
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
                        <div className="flex items-center space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="agent-status" checked={isActive} onCheckedChange={setIsActive} />
                                <Label htmlFor="agent-status">{t.agentStatus}</Label>
                            </div>
                            <p className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                                {isActive ? t.agentActive : t.agentInactive}
                            </p>
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
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
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
                            value={knowledgeBase}
                            onChange={(e) => setKnowledgeBase(e.target.value)}
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
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp-api">{t.whatsappApiKey}</Label>
                            <Input id="whatsapp-api" type="password" value={whatsappKey} onChange={(e) => setWhatsappKey(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram-api">{t.instagramApiKey}</Label>
                            <Input id="instagram-api" type="password" value={instagramKey} onChange={(e) => setInstagramKey(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="messenger-api">{t.messengerApiKey}</Label>
                            <Input id="messenger-api" type="password" value={messengerKey} onChange={(e) => setMessengerKey(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="support-email">{t.supportEmail}</Label>
                            <Input id="support-email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
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
                        value={exclusionList}
                        onChange={(e) => setExclusionList(e.target.value)}
                        rows={5}
                        placeholder="proveedor@email.com
+1234567890"
                    />
                </CardContent>
            </Card>

        </div>
    );
}

    