
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Link as LinkIcon, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

const questionnaireId = `eval-${Date.now()}`;
const questionnaireUrl = typeof window !== 'undefined' ? `${window.location.origin}/questionnaire/${questionnaireId}` : '';

const labels = {
  es: {
    pageTitle: "Nuevo Cuestionario de Evaluación",
    pageSubtitle: "Envía un enlace a tu cliente para que complete el formulario.",
    sendToClient: "Enviar a Cliente",
    sendToClientDesc: "Introduce el email del cliente para generar un enlace único para el cuestionario.",
    clientEmail: "Email del Cliente",
    clientEmailPlaceholder: "cliente@email.com",
    linkGenerated: "Enlace Generado",
    linkCopied: "¡Enlace copiado!",
    linkCopiedDesc: "Puedes compartirlo directamente con tu cliente.",
    cancel: "Cancelar",
    generateLink: "Generar Enlace",
    linkGeneratedBtn: "Enlace Generado",
    emailRequired: "Por favor, introduce un email.",
    sentToast: "¡Cuestionario \"enviado\"!",
    sentToastDesc: "Se ha generado un enlace para tu cliente."
  },
  en: {
    pageTitle: "New Evaluation Questionnaire",
    pageSubtitle: "Send a link to your client to fill out the form.",
    sendToClient: "Send to Client",
    sendToClientDesc: "Enter the client's email to generate a unique link for the questionnaire.",
    clientEmail: "Client's Email",
    clientEmailPlaceholder: "client@email.com",
    linkGenerated: "Link Generated",
    linkCopied: "Link copied!",
    linkCopiedDesc: "You can share it directly with your client.",
    cancel: "Cancel",
    generateLink: "Generate Link",
    linkGeneratedBtn: "Link Generated",
    emailRequired: "Please enter an email.",
    sentToast: "Questionnaire \"sent\"!",
    sentToastDesc: "A link has been generated for your client."
  },
  fr: {
    pageTitle: "Nouveau Questionnaire d'Évaluation",
    pageSubtitle: "Envoyez un lien à votre client pour qu'il remplisse le formulaire.",
    sendToClient: "Envoyer au Client",
    sendToClientDesc: "Entrez l'e-mail du client pour générer un lien unique pour le questionnaire.",
    clientEmail: "E-mail du Client",
    clientEmailPlaceholder: "client@email.com",
    linkGenerated: "Lien Généré",
    linkCopied: "Lien copié !",
    linkCopiedDesc: "Vous pouvez le partager directement avec votre client.",
    cancel: "Annuler",
    generateLink: "Générer le Lien",
    linkGeneratedBtn: "Lien Généré",
    emailRequired: "Veuillez saisir un e-mail.",
    sentToast: "Questionnaire \"envoyé\" !",
    sentToastDesc: "Un lien a été généré pour votre client."
  }
};

export default function NewQuestionnairePage() {
  const [clientEmail, setClientEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const handleSend = () => {
    if (!clientEmail) {
      toast({ title: t.emailRequired, variant: 'destructive' });
      return;
    }
    // Simular envío
    console.log(`Enviando cuestionario a ${clientEmail}`);
    setIsSent(true);
    toast({ title: t.sentToast, description: t.sentToastDesc });
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(questionnaireUrl);
      toast({ title: t.linkCopied, description: t.linkCopiedDesc });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({ title: "Error al copiar", description: "No se pudo copiar el enlace al portapapeles.", variant: 'destructive'});
    }
  };

  return (
    <div className="space-y-6">
       <header>
        <h1 className="font-headline text-3xl font-bold">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageSubtitle}</p>
      </header>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t.sendToClient}</CardTitle>
          <CardDescription>{t.sendToClientDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-email">{t.clientEmail}</Label>
            <Input
              id="client-email"
              type="email"
              placeholder={t.clientEmailPlaceholder}
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={isSent}
            />
          </div>
           {isSent && (
            <Alert>
                <LinkIcon className="h-4 w-4" />
                <AlertTitle>{t.linkGenerated}</AlertTitle>
                <AlertDescription>
                  <Link href={questionnaireUrl} target="_blank" className="text-sm underline truncate pr-4">
                    {questionnaireUrl}
                  </Link>
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="ghost" asChild><Link href="/myoffice/questionnaires">{t.cancel}</Link></Button>
            <Button onClick={handleSend} disabled={isSent}>
                <Send className="mr-2" />
                {isSent ? t.linkGeneratedBtn : t.generateLink}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    