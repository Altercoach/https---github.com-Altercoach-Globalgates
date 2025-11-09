
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Save, FileText, BrainCircuit, Upload, User, Image as ImageIcon, KeyRound, MessageSquare, Linkedin, Twitter, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useSite } from '@/hooks/use-site';
import { initialCustomers } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';

const labels = {
  es: {
    pageTitle: "Configuración de tu Agente de IA",
    pageSubtitle: "Personaliza la identidad y el conocimiento de tu asistente virtual.",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Agente guardado!",
    toastSuccessDescription: "La configuración de tu agente ha sido actualizada.",
    agentProfileTitle: "Identidad del Agente",
    agentProfileDesc: "Dale un nombre y un rostro a tu agente para una interacción más humana.",
    agentFirstName: "Nombre",
    agentLastName: "Apellido",
    agentAvatar: "Foto de Perfil",
    knowledgeBase: "Base de Conocimiento (Entrenamiento)",
    knowledgeBaseDesc: "Pega aquí URLs, FAQs, o cualquier información que el agente deba conocer.",
    integrations: "Conexión de Canales",
    integrationsDesc: "Activa tus canales de mensajería conectando tus propias claves de API. El número de canales disponibles depende de tu plan.",
    whatsappApiKey: "WhatsApp API Key",
    instagramApiKey: "Instagram API Key",
    messengerApiKey: "Facebook Messenger API Key",
    planInfo: "Tu plan actual es",
    planUpgrade: "Actualiza tu plan para conectar más canales."
  },
  en: {
    pageTitle: "Your AI Agent Configuration",
    pageSubtitle: "Customize the identity and knowledge of your virtual assistant.",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Agent saved!",
    toastSuccessDescription: "Your agent's configuration has been updated.",
    agentProfileTitle: "Agent Identity",
    agentProfileDesc: "Give your agent a name and a face for a more human-like interaction.",
    agentFirstName: "First Name",
    agentLastName: "Last Name",
    agentAvatar: "Profile Picture",
    knowledgeBase: "Knowledge Base (Training)",
    knowledgeBaseDesc: "Paste URLs, FAQs, or any information the agent should know.",
    integrations: "Channel Connections",
    integrationsDesc: "Activate your messaging channels by connecting your own API keys. The number of available channels depends on your plan.",
    whatsappApiKey: "WhatsApp API Key",
    instagramApiKey: "Instagram API Key",
    messengerApiKey: "Facebook Messenger API Key",
    planInfo: "Your current plan is",
    planUpgrade: "Upgrade your plan to connect more channels."
  },
  fr: {
    pageTitle: "Configuration de Votre Agent IA",
    pageSubtitle: "Personnalisez l'identité et les connaissances de votre assistant virtuel.",
    saveChanges: "Enregistrer les modifications",
    toastSuccessTitle: "Agent enregistré !",
    toastSuccessDescription: "La configuration de votre agent a été mise à jour.",
    agentProfileTitle: "Identité de l'Agent",
    agentProfileDesc: "Donnez un nom et un visage à votre agent pour une interaction plus humaine.",
    agentFirstName: "Prénom",
    agentLastName: "Nom de famille",
    agentAvatar: "Photo de profil",
    knowledgeBase: "Base de Connaissances (Formation)",
    knowledgeBaseDesc: "Collez ici les URL, FAQ ou toute information que l'agent doit connaître.",
    integrations: "Connexions des Canaux",
    integrationsDesc: "Activez vos canaux de messagerie en connectant vos propres clés API. Le nombre de canaux disponibles dépend de votre plan.",
    whatsappApiKey: "Clé API WhatsApp",
    instagramApiKey: "Clé API Instagram",
    messengerApiKey: "Clé API Facebook Messenger",
    planInfo: "Votre plan actuel est",
    planUpgrade: "Mettez à niveau votre plan pour connecter plus de canaux."
  }
};

const defaultKnowledgeBase = `FAQ:
- ¿Cuáles son sus horarios? Lunes a Viernes de 9am a 7pm.
- ¿Dónde están ubicados? Nuestra oficina principal está en Tijuana.

Información de Productos:
- El 'cold brew' es nuestro producto más vendido.
- El pastel de zanahoria es horneado diariamente.`;


export default function CustomerAgentConfigPage() {
    const { language } = useLanguage();
    const { auth } = useAuth();
    const t = labels[language.code as keyof typeof labels] || labels.en;
    const { toast } = useToast();

    // Find the current customer's data to determine their plan
    const customer = initialCustomers.find(c => c.email === auth.user?.email);
    const planName = customer ? customer.plan : "N/A";

    const [firstName, setFirstName] = useState("Agente");
    const [lastName, setLastName] = useState("Digital");
    const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?u=customeragent");
    const [knowledgeBase, setKnowledgeBase] = useState(defaultKnowledgeBase);
    
    const [whatsappKey, setWhatsappKey] = useState('');
    const [instagramKey, setInstagramKey] = useState('');

    const triggerFilePicker = () => document.getElementById('avatarPicker')?.click();
    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => setAvatar(event.target?.result as string);
        reader.readAsDataURL(file);
    };
    
    const handleSave = () => {
        toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
    }

    // Logic to determine available channels based on the plan
    const isVipPlan = planName.toLowerCase().includes('vip');
    const availableChannels = isVipPlan ? 2 : 1; // Example logic

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
                           <Image src={avatar} alt="Agent Avatar" width={128} height={128} className="rounded-full object-cover border-4 border-muted"/>
                        </div>
                        <Button variant="outline" size="sm" onClick={triggerFilePicker}><Upload className="mr-2"/> Cambiar</Button>
                        <Input id="avatarPicker" type="file" accept="image/*" onChange={handleAvatarPick} className="hidden"/>
                    </div>
                     <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="agent-name">{t.agentFirstName}</Label>
                                <Input id="agent-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agent-lastname">{t.agentLastName}</Label>
                                <Input id="agent-lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                    </div>
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
                        rows={10}
                         className="font-mono text-xs"
                    />
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><KeyRound /> {t.integrations}</CardTitle>
                    <CardDescription>{t.integrationsDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{t.planInfo}: <strong>{planName}</strong></AlertTitle>
                        <AlertDescription>{t.planUpgrade}</AlertDescription>
                    </Alert>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableChannels >= 1 && (
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp-api" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t.whatsappApiKey}</Label>
                                <Input id="whatsapp-api" type="password" value={whatsappKey} onChange={(e) => setWhatsappKey(e.target.value)} placeholder="Introduce tu clave..."/>
                            </div>
                        )}
                        {availableChannels >= 2 && (
                            <div className="space-y-2">
                                <Label htmlFor="instagram-api" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t.instagramApiKey}</Label>
                                <Input id="instagram-api" type="password" value={instagramKey} onChange={(e) => setInstagramKey(e.target.value)} placeholder="Introduce tu clave..."/>
                            </div>
                        )}
                        <div className={`space-y-2 ${availableChannels < 3 ? 'opacity-50' : ''}`}>
                            <Label htmlFor="messenger-api" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t.messengerApiKey}</Label>
                            <Input id="messenger-api" disabled={availableChannels < 3} placeholder="Actualiza tu plan"/>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
             <div className="flex justify-end">
                <Button onClick={handleSave}><Save className="mr-2"/>{t.saveChanges}</Button>
            </div>
        </div>
    );
}
