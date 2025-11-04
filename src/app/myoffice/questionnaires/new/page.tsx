
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Link as LinkIcon, Clipboard, ArrowLeft, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Textarea } from '@/components/ui/textarea';

const labels = {
  es: {
    back: "Volver a Cuestionarios",
    pageTitle: "Generador de Cuestionario",
    pageSubtitle: "Crea y asigna un nuevo cuestionario a un cliente.",
    configTitle: "Configuración y Contenido",
    configDesc: "Define el título, el cliente y pega las preguntas para generar un enlace.",
    questionnaireTitle: "Título del Cuestionario",
    questionnaireTitlePlaceholder: "Ej: Brief de Marketing Avanzado",
    clientEmail: "Email del Cliente",
    clientEmailPlaceholder: "cliente@email.com",
    questionsLabel: "Preguntas (una por línea)",
    questionsPlaceholder: "¿Cuál es tu objetivo principal?\n¿Quién es tu competencia directa?\n¿Cuál es tu presupuesto?",
    generateLink: "Generar Enlace y Enviar",
    linkGenerated: "¡Enlace Generado para el Cliente!",
    linkCopied: "¡Enlace copiado!",
    linkCopiedDesc: "Puedes compartirlo directamente con tu cliente.",
    emailRequired: "Por favor, introduce un email.",
    sentToast: "¡Cuestionario \"enviado\"!",
    sentToastDesc: "Se ha generado un enlace para tu cliente.",
    createAnother: "Crear otro cuestionario"
  },
  en: {
    back: "Back to Questionnaires",
    pageTitle: "Questionnaire Generator",
    pageSubtitle: "Create and assign a new questionnaire to a client.",
    configTitle: "Configuration & Content",
    configDesc: "Set the title, client, and paste the questions to generate a link.",
    questionnaireTitle: "Questionnaire Title",
    questionnaireTitlePlaceholder: "e.g., Advanced Marketing Brief",
    clientEmail: "Client's Email",
    clientEmailPlaceholder: "client@email.com",
    questionsLabel: "Questions (one per line)",
    questionsPlaceholder: "What is your main goal?\nWho is your direct competition?\nWhat is your budget?",
    generateLink: "Generate Link & Send",
    linkGenerated: "Link Generated for Client!",
    linkCopied: "Link copied!",
    linkCopiedDesc: "You can share it directly with your client.",
    emailRequired: "Please enter an email.",
    sentToast: "Questionnaire \"sent\"!",
    sentToastDesc: "A link has been generated for your client.",
    createAnother: "Create another questionnaire"
  },
  fr: {
    back: "Retour aux Questionnaires",
    pageTitle: "Générateur de Questionnaire",
    pageSubtitle: "Créez et assignez un nouveau questionnaire à un client.",
    configTitle: "Configuration et Contenu",
    configDesc: "Définissez le titre, le client et collez les questions pour générer un lien.",
    questionnaireTitle: "Titre du Questionnaire",
    questionnaireTitlePlaceholder: "Ex: Brief Marketing Avancé",
    clientEmail: "E-mail du Client",
    clientEmailPlaceholder: "client@email.com",
    questionsLabel: "Questions (une par ligne)",
    questionsPlaceholder: "Quel est votre objectif principal ?\nQui est votre concurrence directe ?\nQuel est votre budget ?",
    generateLink: "Générer le Lien et Envoyer",
    linkGenerated: "Lien Généré pour le Client !",
    linkCopied: "Lien copié !",
    linkCopiedDesc: "Vous pouvez le partager directement avec votre client.",
    emailRequired: "Veuillez saisir un e-mail.",
    sentToast: "Questionnaire \"envoyé\" !",
    sentToastDesc: "Un lien a été généré pour votre client.",
    createAnother: "Créer un autre questionnaire"
  }
};

export default function NewQuestionnairePage() {
  const [clientEmail, setClientEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [questionnaireUrl, setQuestionnaireUrl] = useState('');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('client-email');

    if (!email) {
      toast({ title: t.emailRequired, variant: 'destructive' });
      return;
    }
    
    const newId = `q-${Date.now()}`;
    const url = typeof window !== 'undefined' ? `${window.location.origin}/questionnaire/${newId}` : '';
    setQuestionnaireUrl(url);

    setIsSent(true);
    toast({ title: t.sentToast, description: t.sentToastDesc });
  };

  const copyToClipboard = () => {
    if (!questionnaireUrl) return;
    try {
      navigator.clipboard.writeText(questionnaireUrl);
      toast({ title: t.linkCopied, description: t.linkCopiedDesc });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({ title: "Error copying", description: "Could not copy link to clipboard.", variant: 'destructive'});
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/myoffice/questionnaires"><ArrowLeft className="mr-2"/> {t.back}</Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageSubtitle}</p>
      </header>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> {t.configTitle}</CardTitle>
          <CardDescription>{t.configDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSent ? (
             <div className="space-y-4">
                <Alert>
                    <LinkIcon className="h-4 w-4" />
                    <AlertTitle>{t.linkGenerated}</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                      <Link href={questionnaireUrl} target="_blank" className="text-sm underline truncate pr-4">
                        {questionnaireUrl}
                      </Link>
                      <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </AlertDescription>
                </Alert>
                 <Button onClick={() => setIsSent(false)} className="w-full">{t.createAnother}</Button>
            </div>
          ) : (
             <form onSubmit={handleSend} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="questionnaire-title">{t.questionnaireTitle}</Label>
                    <Input id="questionnaire-title" name="questionnaire-title" placeholder={t.questionnaireTitlePlaceholder} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="client-email">{t.clientEmail}</Label>
                    <Input
                        id="client-email"
                        name="client-email"
                        type="email"
                        placeholder={t.clientEmailPlaceholder}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="questions">{t.questionsLabel}</Label>
                    <Textarea
                        id="questions"
                        name="questions"
                        placeholder={t.questionsPlaceholder}
                        rows={10}
                        required
                    />
                 </div>

                <Button type="submit" className="w-full">
                    <Send className="mr-2" />
                    {t.generateLink}
                </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
