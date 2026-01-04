
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Link as LinkIcon, Clipboard, ArrowLeft, Bot, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Textarea } from '@/components/ui/textarea';

const labels = {
  es: {
    back: "Volver a Cuestionarios",
    pageTitle: "Generador de Plantillas de Cuestionario",
    pageSubtitle: "Usa la IA para generar una nueva plantilla de cuestionario.",
    configTitle: "Asistente de Creación de Plantillas",
    configDesc: "Describe el propósito del cuestionario y la IA generará las preguntas por ti.",
    questionnaireTitle: "Título de la Plantilla",
    questionnaireTitlePlaceholder: "Ej: Cuestionario de Onboarding para Fotógrafos",
    promptLabel: "Descripción del Cuestionario",
    promptPlaceholder: "Ej: 'Genera un cuestionario para un cliente que contrató un plan de redes sociales. Necesito saber sus objetivos, público objetivo, competidores y qué tipo de contenido le gusta.'",
    generateButton: "Generar Preguntas con IA",
    saveButton: "Guardar Plantilla",
    linkGenerated: "¡Plantilla Generada y Guardada!",
    linkCopied: "¡Enlace copiado!",
    linkCopiedDesc: "Puedes verla y asignarla a tus planes de servicio.",
    emailRequired: "Por favor, introduce un email.",
    sentToast: "¡Plantilla generada!",
    sentToastDesc: "La nueva plantilla está lista para ser asignada.",
    createAnother: "Crear otra plantilla"
  },
  en: {
    back: "Back to Questionnaires",
    pageTitle: "Questionnaire Template Generator",
    pageSubtitle: "Use AI to generate a new questionnaire template.",
    configTitle: "Template Creation Assistant",
    configDesc: "Describe the purpose of the questionnaire, and the AI will generate the questions for you.",
    questionnaireTitle: "Template Title",
    questionnaireTitlePlaceholder: "e.g., Onboarding Questionnaire for Photographers",
    promptLabel: "Questionnaire Description",
    promptPlaceholder: "e.g., 'Generate a questionnaire for a client who hired a social media plan. I need to know their goals, target audience, competitors, and what kind of content they like.'",
    generateButton: "Generate Questions with AI",
    saveButton: "Save Template",
    linkGenerated: "Template Generated and Saved!",
    linkCopied: "Link copied!",
    linkCopiedDesc: "You can view it and assign it to your service plans.",
    createAnother: "Create another template"
  },
  fr: {
    back: "Retour aux Questionnaires",
    pageTitle: "Générateur de Modèles de Questionnaire",
    pageSubtitle: "Utilisez l'IA pour générer un nouveau modèle de questionnaire.",
    configTitle: "Assistant de Création de Modèles",
    configDesc: "Décrivez le but du questionnaire, et l'IA générera les questions pour vous.",
    questionnaireTitle: "Titre du Modèle",
    questionnaireTitlePlaceholder: "Ex: Questionnaire d'Onboarding pour Photographes",
    promptLabel: "Description du Questionnaire",
    promptPlaceholder: "Ex: 'Générez un questionnaire pour un client qui a engagé un plan de médias sociaux. J'ai besoin de connaître ses objectifs, son public cible, ses concurrents et le type de contenu qu'il aime.'",
    generateButton: "Générer des Questions avec l'IA",
    saveButton: "Enregistrer le Modèle",
    linkGenerated: "Modèle Généré et Enregistré !",
    linkCopied: "Lien copié !",
    linkCopiedDesc: "Vous pouvez le voir et l'assigner à vos plans de service.",
    emailRequired: "Veuillez saisir un e-mail.",
    sentToast: "Modèle généré !",
    sentToastDesc: "Le nouveau modèle est prêt à être assigné.",
    createAnother: "Créer un autre modèle"
  }
};

export default function NewQuestionnairePage() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [questionnaireUrl, setQuestionnaireUrl] = useState('');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate AI generation and saving
    const newId = `q-template-${Date.now()}`;
    // The link should go to a generic edit page. Let's correct this.
    const url = typeof window !== 'undefined' ? `${window.location.origin}/myoffice/questionnaires/edit` : '';
    setQuestionnaireUrl(url); // This will just link to the static edit page for now.

    setIsGenerated(true);
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
          <CardTitle className="flex items-center gap-2"><Wand2 /> {t.configTitle}</CardTitle>
          <CardDescription>{t.configDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerated ? (
             <div className="space-y-4">
                <Alert>
                    <LinkIcon className="h-4 w-4" />
                    <AlertTitle>{t.linkGenerated}</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                      <Link href={questionnaireUrl} className="text-sm underline truncate pr-4">
                        Ver y editar nueva plantilla
                      </Link>
                      <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </AlertDescription>
                </Alert>
                 <Button onClick={() => setIsGenerated(false)} className="w-full">{t.createAnother}</Button>
            </div>
          ) : (
             <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="questionnaire-title">{t.questionnaireTitle}</Label>
                    <Input id="questionnaire-title" name="questionnaire-title" placeholder={t.questionnaireTitlePlaceholder} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="prompt">{t.promptLabel}</Label>
                    <Textarea
                        id="prompt"
                        name="prompt"
                        placeholder={t.promptPlaceholder}
                        rows={6}
                        required
                    />
                 </div>

                <Button type="submit" className="w-full">
                    <Bot className="mr-2" />
                    {t.generateButton}
                </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
