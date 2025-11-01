
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Save, FileText, BrainCircuit } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const labels = {
  es: {
    pageTitle: "Configuración del Agente de IA",
    pageSubtitle: "Define el cerebro y la personalidad de tu asistente virtual.",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Agente guardado!",
    toastSuccessDescription: "La configuración de tu agente de IA ha sido actualizada.",
    agentStatus: "Estado del Agente",
    agentActive: "Activo",
    agentInactive: "Inactivo",
    systemPrompt: "Prompt del Sistema (Órdenes Ejecutivas)",
    systemPromptDesc: "Este es el cerebro del agente. Define su personalidad, rol, reglas y cómo debe comportarse. La IA lo usará como su instrucción principal en cada interacción.",
    knowledgeBase: "Base de Conocimiento (Entrenamiento)",
    knowledgeBaseDesc: "Pega aquí URLs, FAQs, detalles de productos o cualquier información que el agente deba conocer. Usará esto como su 'memoria' para responder preguntas.",
    integrations: "Integraciones de API",
    integrationsDesc: "Conecta tu agente a las APIs de mensajería. (Campos de ejemplo)",
    whatsappApiKey: "WhatsApp API Key",
    comingSoon: "Más integraciones próximamente."
  },
  en: {
    pageTitle: "AI Agent Configuration",
    pageSubtitle: "Define the brain and personality of your virtual assistant.",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Agent saved!",
    toastSuccessDescription: "Your AI agent's configuration has been updated.",
    agentStatus: "Agent Status",
    agentActive: "Active",
    agentInactive: "Inactive",
    systemPrompt: "System Prompt (Executive Orders)",
    systemPromptDesc: "This is the agent's brain. It defines its personality, role, rules, and how it should behave. The AI will use this as its main instruction in every interaction.",
    knowledgeBase: "Knowledge Base (Training)",
    knowledgeBaseDesc: "Paste URLs, FAQs, product details, or any information the agent should know here. It will use this as its 'memory' to answer questions.",
    integrations: "API Integrations",
    integrationsDesc: "Connect your agent to messaging APIs. (Example fields)",
    whatsappApiKey: "WhatsApp API Key",
    comingSoon: "More integrations coming soon."
  },
  fr: {
    pageTitle: "Configuration de l'Agent IA",
    pageSubtitle: "Définissez le cerveau et la personnalité de votre assistant virtuel.",
    saveChanges: "Enregistrer les modifications",
    toastSuccessTitle: "Agent enregistré !",
    toastSuccessDescription: "La configuration de votre agent IA a été mise à jour.",
    agentStatus: "Statut de l'Agent",
    agentActive: "Actif",
    agentInactive: "Inactif",
    systemPrompt: "Prompt Système (Ordres Exécutifs)",
    systemPromptDesc: "C'est le cerveau de l'agent. Il définit sa personnalité, son rôle, ses règles et son comportement. L'IA l'utilisera comme instruction principale à chaque interaction.",
    knowledgeBase: "Base de Connaissances (Formation)",
    knowledgeBaseDesc: "Collez ici les URL, FAQ, détails de produits ou toute information que l'agent doit connaître. Il l'utilisera comme sa 'mémoire' pour répondre aux questions.",
    integrations: "Intégrations d'API",
    integrationsDesc: "Connectez votre agent aux API de messagerie. (Champs d'exemple)",
    whatsappApiKey: "Clé API WhatsApp",
    comingSoon: "Plus d'intégrations à venir."
  }
};

const defaultSystemPrompt = `Eres 'Asistente Pro', un agente de ventas y soporte al cliente para Golden Key. Tu rol es ser amigable, proactivo y muy eficiente.
OBJETIVO: Convertir visitantes en leads calificados y resolver dudas de primer nivel.
REGLAS:
1. SIEMPRE pide nombre, email y teléfono para registrar un lead.
2. NUNCA ofrezcas descuentos a menos que se indique en la BASE DE CONOCIMIENTO.
3. Si no sabes una respuesta, di: "Excelente pregunta. Permíteme consultarlo con un especialista para darte la información precisa. ¿Me das tu correo para contactarte?". Y registra el lead.
4. Usa la BASE DE CONOCIMIENTO como tu única fuente de verdad.`;

const defaultKnowledgeBase = `https://goldenkey.website/products
https://goldenkey.website/contact

Horario de atención humana: Lunes a Viernes, 9am - 6pm (Hora del Pacífico).
Promoción actual: 10% de descuento en el plan 'Portal Maestro Digital' para nuevos clientes. Código: LAUNCH10.`;


export default function AgentConfigPage() {
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const [isActive, setIsActive] = useState(true);
    const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
    const [knowledgeBase, setKnowledgeBase] = useState(defaultKnowledgeBase);
    const [apiKey, setApiKey] = useState('wh_xxxxxxxx');

    const saveChanges = () => {
        toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
                <p className="text-muted-foreground">{t.pageSubtitle}</p>
            </header>

            <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                    <Switch id="agent-status" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="agent-status">{t.agentStatus}</Label>
                </div>
                <p className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {isActive ? t.agentActive : t.agentInactive}
                </p>
            </div>

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
                    <CardTitle>{t.integrations}</CardTitle>
                    <CardDescription>{t.integrationsDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp-api">{t.whatsappApiKey}</Label>
                        <Input 
                            id="whatsapp-api" 
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                    <Alert variant="default">
                        <Bot className="h-4 w-4" />
                        <AlertTitle>{t.comingSoon}</AlertTitle>
                    </Alert>
                </CardContent>
            </Card>


            <div className="flex justify-end">
                <Button onClick={saveChanges}><Save className="mr-2"/>{t.saveChanges}</Button>
            </div>
        </div>
    );
}
