
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Bot, Download, Loader2, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { generateAgentPrompt, GenerateAgentPromptOutput } from '@/ai/flows/generate-agent-prompt';
import { useState, useEffect, useMemo, use } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const sampleAnswers = {
  eval: {
    'Sección 1: Información General del Negocio': {
      '¿Cuáles son los principales productos y servicios que ofrece tu negocio?': 'Café de especialidad, pastelería artesanal y desayunos.',
      '¿Cuál es tu producto o servicio estrella?': 'Nuestro café "cold brew" y el pastel de zanahoria.',
    },
    'Sección 2: Objetivos de Marketing': {
      '¿Cuál es su principal objetivo con esta estrategia?': 'Aumentar las ventas en un 20% y posicionar la marca en la zona centro.',
    }
  },
  agent: {
      'Sección 1: Leads y Seguimiento Comercial': {
        'Canales preferidos para que el agente contacte a leads (WhatsApp, correo, llamada, chat web)': 'WhatsApp y correo electrónico.',
        'Criterios para considerar un lead “calificado” o “prioritario”': 'Clientes que pregunten por nuestros granos de café de origen único o por pedidos de más de 10 pasteles.',
      },
      'Sección 3: Atención al Cliente': {
          'Tono de comunicación deseado: Formal / Cercano / Amigable / Técnico / Otro:': 'Cercano y amigable, pero conocedor del café.',
      }
  }
};

const labels = {
  es: {
    back: "Volver a Cuestionarios",
    pageTitle: "Respuestas del Cliente",
    reviewing: "Revisando",
    responsesTitle: "Respuestas del Cuestionario",
    analysisTitle: "Análisis y Recomendación de IA",
    loadingAnalysis: "La IA está analizando las respuestas...",
    analysisError: "Error de Análisis",
    analysisErrorDesc: "La IA no pudo procesar las respuestas. Por favor, inténtalo de nuevo más tarde.",
    noAnalysis: "No se pudo generar el análisis.",
    pendingAnalysis: "El análisis se generará automáticamente una vez que el cliente envíe sus respuestas.",
    clientVisibility: "Permitir que el cliente vea este análisis",
    visibilityOn: "Visibilidad para el cliente activada.",
    visibilityOnDesc: "El cliente ahora puede ver este análisis.",
    visibilityOff: "Visibilidad para el cliente desactivada.",
    visibilityOffDesc: "El cliente ya no puede ver este análisis.",
    download: "Descargar Análisis (PDF)",
    agentProfileTitle: "Perfil del Agente de IA",
    agentRole: "Rol Principal",
    agentTone: "Tono de Voz",
    agentPsychology: "Psicología y Comportamiento",
    agentArchetype: "Arquetipo",
    agentTraits: "Rasgos Clave",
    agentSystemPrompt: "Prompt Generado para el Sistema",
    swotAnalysis: "Análisis FODA",
    strengths: "Fortalezas",
    opportunities: "Oportunidades",
    weaknesses: "Debilidades",
    threats: "Amenazas",
    recommendations: "Recomendaciones Estratégicas",
    questionnaireTypes: {
      'agent-training-001': "Entrenamiento de Agente de IA",
      default: "Evaluación de Negocio"
    }
  },
  en: {
    back: "Back to Questionnaires",
    pageTitle: "Customer Responses",
    reviewing: "Reviewing",
    responsesTitle: "Questionnaire Responses",
    analysisTitle: "AI Analysis & Recommendation",
    loadingAnalysis: "The AI is analyzing the responses...",
    analysisError: "Analysis Error",
    analysisErrorDesc: "The AI could not process the responses. Please try again later.",
    noAnalysis: "Could not generate analysis.",
    pendingAnalysis: "The analysis will be generated automatically once the customer submits their responses.",
    clientVisibility: "Allow customer to see this analysis",
    visibilityOn: "Visibility for customer enabled.",
    visibilityOnDesc: "The customer can now see this analysis.",
    visibilityOff: "Visibility for customer disabled.",
    visibilityOffDesc: "The customer can no longer see this analysis.",
    download: "Download Analysis (PDF)",
    agentProfileTitle: "AI Agent Profile",
    agentRole: "Main Role",
    agentTone: "Tone of Voice",
    agentPsychology: "Psychology and Behavior",
    agentArchetype: "Archetype",
    agentTraits: "Key Traits",
    agentSystemPrompt: "Generated System Prompt",
    swotAnalysis: "SWOT Analysis",
    strengths: "Strengths",
    opportunities: "Opportunities",
    weaknesses: "Weaknesses",
    threats: "Threats",
    recommendations: "Strategic Recommendations",
    questionnaireTypes: {
      'agent-training-001': "AI Agent Training",
      default: "Business Evaluation"
    }
  },
  fr: {
    back: "Retour aux Questionnaires",
    pageTitle: "Réponses du Client",
    reviewing: "Examen en cours",
    responsesTitle: "Réponses au Questionnaire",
    analysisTitle: "Analyse et Recommandation de l'IA",
    loadingAnalysis: "L'IA analyse les réponses...",
    analysisError: "Erreur d'Analyse",
    analysisErrorDesc: "L'IA n'a pas pu traiter les réponses. Veuillez réessayer plus tard.",
    noAnalysis: "Impossible de générer l'analyse.",
    pendingAnalysis: "L'analyse sera générée automatiquement une fois que le client aura soumis ses réponses.",
    clientVisibility: "Autoriser le client à voir cette analyse",
    visibilityOn: "Visibilité pour le client activée.",
    visibilityOnDesc: "Le client peut maintenant voir cette analyse.",
    visibilityOff: "Visibilité pour le client désactivée.",
    visibilityOffDesc: "Le client ne peut plus voir cette analyse.",
    download: "Télécharger l'Analyse (PDF)",
    agentProfileTitle: "Profil de l'Agent IA",
    agentRole: "Rôle Principal",
    agentTone: "Ton de la Voix",
    agentPsychology: "Psychologie et Comportement",
    agentArchetype: "Archétype",
    agentTraits: "Traits Clés",
    agentSystemPrompt: "Prompt Système Généré",
    swotAnalysis: "Analyse SWOT",
    strengths: "Forces",
    opportunities: "Opportunités",
    weaknesses: "Faiblesses",
    threats: "Menaces",
    recommendations: "Recommandations Stratégiques",
    questionnaireTypes: {
      'agent-training-001': "Formation d'Agent IA",
      default: "Évaluation d'Entreprise"
    }
  }
};


export default function QuestionnaireResponsePage({ params }: { params: { id: string } }) {
  const { id: questionnaireId } = params;
  const isCompleted = questionnaireId === 'brief-001' || questionnaireId === 'agent-training-001' || questionnaireId === 'business-evaluation-001';
  const isAgentTraining = questionnaireId === 'agent-training-001';
  const { toast } = useToast();

  const [businessAnalysis, setBusinessAnalysis] = useState<AnalyzeBusinessEvaluationOutput | null>(null);
  const [agentPrompt, setAgentPrompt] = useState<GenerateAgentPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClientVisible, setIsClientVisible] = useState(false);
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const questionnaireTitle = useMemo(() => {
      const key = isAgentTraining ? 'agent-training-001' : 'default';
      return t.questionnaireTypes[key];
  }, [isAgentTraining, t]);

  const currentAnswers = useMemo(() => {
    if (isAgentTraining) return sampleAnswers.agent;
    return sampleAnswers.eval;
  }, [isAgentTraining]);

  useEffect(() => {
    if (!isCompleted) return;

    const getAnalysis = async () => {
      setIsLoading(true);
      setBusinessAnalysis(null);
      setAgentPrompt(null);
      try {
        if (isAgentTraining) {
            const result = await generateAgentPrompt({
                answersJson: JSON.stringify(currentAnswers),
            });
            setAgentPrompt(result);
        } else {
            const result = await analyzeBusinessEvaluation({ 
                answersJson: JSON.stringify(currentAnswers),
                targetLanguage: language.code,
            });
            setBusinessAnalysis(result);
        }
      } catch (error) {
        console.error("Analysis failed", error);
        toast({
          variant: "destructive",
          title: t.analysisError,
          description: t.analysisErrorDesc,
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAnalysis();
  }, [isCompleted, isAgentTraining, language.code, currentAnswers, toast, t]);

  const handleVisibilityToggle = (checked: boolean) => {
    setIsClientVisible(checked);
    toast({
        title: checked ? t.visibilityOn : t.visibilityOff,
        description: checked ? t.visibilityOnDesc : t.visibilityOffDesc,
    });
  }
  
  const renderAnalysis = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>{t.loadingAnalysis}</p>
        </div>
      );
    }

    if (businessAnalysis) {
      return (
         <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
            <h4>{t.swotAnalysis}</h4>
            <div className="grid grid-cols-2 gap-x-4">
                <p><strong>{t.strengths}:</strong> {businessAnalysis.swot.strengths}</p>
                <p><strong>{t.opportunities}:</strong> {businessAnalysis.swot.opportunities}</p>
                <p><strong>{t.weaknesses}:</strong> {businessAnalysis.swot.weaknesses}</p>
                <p><strong>{t.threats}:</strong> {businessAnalysis.swot.threats}</p>
            </div>
            <h4 className="mt-4">{t.recommendations}</h4>
            <div className="text-sm font-sans whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: businessAnalysis.recommendations.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      )
    }

    if (agentPrompt) {
         return (
            <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                <h4>{t.agentProfileTitle}</h4>
                <p><strong>{t.agentRole}:</strong> {agentPrompt.profile.role}</p>
                <p><strong>{t.agentTone}:</strong> {agentPrompt.profile.tone}</p>
                
                <h4 className="mt-4">{t.agentPsychology}</h4>
                <p><strong>{t.agentArchetype}:</strong> {agentPrompt.psychology.archetype}</p>
                <p><strong>{t.agentTraits}:</strong> {agentPrompt.psychology.traits}</p>

                <h4 className="mt-4">{t.agentSystemPrompt}</h4>
                <Card className="bg-background mt-2">
                    <CardContent className="p-4 text-xs">
                        <pre className="whitespace-pre-wrap font-sans">{agentPrompt.systemPrompt}</pre>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="text-center py-8 text-muted-foreground">
            <p>{isCompleted ? t.noAnalysis : t.pendingAnalysis}</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/myoffice/questionnaires"><ArrowLeft className="mr-2"/> {t.back}</Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.reviewing}: {questionnaireTitle}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna de Respuestas */}
        <Card>
          <CardHeader>
            <CardTitle>{t.responsesTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCompleted ? (
              Object.entries(currentAnswers).map(([section, answers]: [string, any]) => (
                <div key={section}>
                  <h4 className="font-semibold text-lg mb-2">{section}</h4>
                  <div className="space-y-4 text-sm">
                    {Object.entries(answers).map(([question, answer]: [string, any]) => (
                      <div key={question}>
                        <p className="text-muted-foreground">{question}</p>
                        <p className="font-medium pl-2 border-l-2 border-primary">{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">{t.pendingAnalysis}</p>
            )}
          </CardContent>
        </Card>

        {/* Columna de Análisis IA */}
        <Card className="bg-primary/5 sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> {t.analysisTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderAnalysis()}
          </CardContent>
           {isCompleted && (businessAnalysis || agentPrompt) && (
            <CardFooter className="flex-col items-start gap-4">
                <div className="flex items-center space-x-2">
                    <Switch id="client-visibility" checked={isClientVisible} onCheckedChange={handleVisibilityToggle} />
                    <Label htmlFor="client-visibility" className="flex items-center gap-2">
                        {isClientVisible ? <Eye /> : <EyeOff/>}
                        {t.clientVisibility}
                    </Label>
                </div>
                <Button variant="secondary" className="w-full">
                    <Download className="mr-2" />
                    {t.download}
                </Button>
            </CardFooter>
           )}
        </Card>
      </div>

    </div>
  );
}
