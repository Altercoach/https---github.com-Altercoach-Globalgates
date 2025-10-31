'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Bot, Download, Loader2, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { generateAgentPrompt, GenerateAgentPromptOutput } from '@/ai/flows/generate-agent-prompt';
import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Datos de ejemplo para las respuestas. En el futuro, esto vendrá de la base de datos.
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


export default function QuestionnaireResponsePage({ params }: { params: { id: string } }) {
  const questionnaireId = params.id;
  const isCompleted = questionnaireId === 'brief-001' || questionnaireId === 'agent-training-001';
  const isAgentTraining = questionnaireId === 'agent-training-001';
  const { toast } = useToast();

  const [businessAnalysis, setBusinessAnalysis] = useState<AnalyzeBusinessEvaluationOutput | null>(null);
  const [agentPrompt, setAgentPrompt] = useState<GenerateAgentPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClientVisible, setIsClientVisible] = useState(false);
  const { language } = useLanguage();

  const questionnaireTitle = useMemo(() => {
    if (isAgentTraining) return 'Entrenamiento de Agente de IA';
    // Add other types here
    return 'Evaluación de Negocio';
  }, [isAgentTraining]);

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
      } finally {
        setIsLoading(false);
      }
    };
    getAnalysis();
  }, [isCompleted, isAgentTraining, language, currentAnswers]);

  const handleVisibilityToggle = (checked: boolean) => {
    setIsClientVisible(checked);
    toast({
        title: `Visibilidad para el cliente ${checked ? 'activada' : 'desactivada'}.`,
        description: `El cliente ${checked ? 'ahora puede ver' : 'ya no puede ver'} este análisis.`,
    });
  }
  
  const renderAnalysis = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>La IA está analizando las respuestas...</p>
        </div>
      );
    }

    if (businessAnalysis) {
      return (
         <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
            <h4>Análisis FODA</h4>
            <div className="grid grid-cols-2 gap-x-4">
                <p><strong>Fortalezas:</strong> {businessAnalysis.swot.strengths}</p>
                <p><strong>Oportunidades:</strong> {businessAnalysis.swot.opportunities}</p>
                <p><strong>Debilidades:</strong> {businessAnalysis.swot.weaknesses}</p>
                <p><strong>Amenazas:</strong> {businessAnalysis.swot.threats}</p>
            </div>
            <h4 className="mt-4">Recomendaciones Estratégicas</h4>
            <div 
                className="whitespace-pre-wrap font-sans text-sm" 
                dangerouslySetInnerHTML={{ __html: businessAnalysis.recommendations.replace(/\* /g, '• ').replace(/\n/g, '<br />') }}
            />
        </div>
      )
    }

    if (agentPrompt) {
         return (
            <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                <h4>Perfil del Agente de IA</h4>
                <p><strong>Rol Principal:</strong> {agentPrompt.profile.role}</p>
                <p><strong>Tono de Voz:</strong> {agentPrompt.profile.tone}</p>
                
                <h4 className="mt-4">Psicología y Comportamiento</h4>
                <p><strong>Arquetipo:</strong> {agentPrompt.psychology.archetype}</p>
                <p><strong>Rasgos Clave:</strong> {agentPrompt.psychology.traits}</p>

                <h4 className="mt-4">Prompt Generado para el Sistema</h4>
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
            <p>{isCompleted ? 'No se pudo generar el análisis.' : 'El análisis se generará automáticamente una vez que el cliente envíe sus respuestas.'}</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/myoffice/questionnaires"><ArrowLeft className="mr-2"/> Volver a Cuestionarios</Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Respuestas del Cliente</h1>
        <p className="text-muted-foreground">Revisando: {questionnaireTitle}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna de Respuestas */}
        <Card>
          <CardHeader>
            <CardTitle>Respuestas del Cuestionario</CardTitle>
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
              <p className="text-muted-foreground text-center py-8">El cliente aún no ha completado este cuestionario.</p>
            )}
          </CardContent>
        </Card>

        {/* Columna de Análisis IA */}
        <Card className="bg-primary/5 sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> Análisis y Recomendación de IA</CardTitle>
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
                        Permitir que el cliente vea este análisis
                    </Label>
                </div>
                <Button variant="secondary" className="w-full">
                    <Download className="mr-2" />
                    Descargar Análisis (PDF)
                </Button>
            </CardFooter>
           )}
        </Card>
      </div>

    </div>
  );
}
