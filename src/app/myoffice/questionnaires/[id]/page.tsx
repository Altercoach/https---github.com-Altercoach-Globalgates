'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Bot, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { useState, useEffect } from 'react';

// Datos de ejemplo para las respuestas. En el futuro, esto vendrá de la base de datos.
const sampleAnswers = {
  'Sección 1: Información General del Negocio': {
    '¿Cuáles son los principales productos y servicios que ofrece tu negocio?': 'Café de especialidad, pastelería artesanal y desayunos.',
    '¿Cuál es tu producto o servicio estrella?': 'Nuestro café "cold brew" y el pastel de zanahoria.',
  },
  'Sección 2: Objetivos de Marketing': {
    '¿Cuál es su principal objetivo con esta estrategia?': 'Aumentar las ventas en un 20% y posicionar la marca en la zona centro.',
  }
};


export default function QuestionnaireResponsePage({ params }: { params: { id: string } }) {
  const isCompleted = params.id === 'brief-001';
  const [analysis, setAnalysis] = useState<AnalyzeBusinessEvaluationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (isCompleted) {
      const getAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
          // Usamos las respuestas de ejemplo para llamar al flujo de IA real
          const result = await analyzeBusinessEvaluation({ answersJson: JSON.stringify(sampleAnswers) });
          setAnalysis(result);
        } catch (error) {
          console.error("Analysis failed", error);
          // Manejar el error en la UI
        } finally {
          setIsLoading(false);
        }
      };
      getAnalysis();
    }
  }, [isCompleted]);
  


  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/myoffice/questionnaires"><ArrowLeft className="mr-2"/> Volver a Cuestionarios</Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Respuestas del Cliente</h1>
        <p className="text-muted-foreground">Revisa la información proporcionada por el cliente y el análisis de la IA.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna de Respuestas */}
        <Card>
          <CardHeader>
            <CardTitle>Respuestas del Cuestionario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCompleted ? (
              Object.entries(sampleAnswers).map(([section, answers]) => (
                <div key={section}>
                  <h4 className="font-semibold text-lg mb-2">{section}</h4>
                  <div className="space-y-4 text-sm">
                    {Object.entries(answers).map(([question, answer]) => (
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>La IA está analizando las respuestas...</p>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                <h4>Análisis FODA</h4>
                <div className="grid grid-cols-2 gap-x-4">
                  <p><strong>Fortalezas:</strong> {analysis.swot.strengths}</p>
                  <p><strong>Oportunidades:</strong> {analysis.swot.opportunities}</p>
                  <p><strong>Debilidades:</strong> {analysis.swot.weaknesses}</p>
                  <p><strong>Amenazas:</strong> {analysis.swot.threats}</p>
                </div>
                <h4 className="mt-4">Recomendaciones Estratégicas</h4>
                <div 
                  className="whitespace-pre-wrap font-sans text-sm" 
                  dangerouslySetInnerHTML={{ __html: analysis.recommendations.replace(/\* /g, '• ').replace(/\n/g, '<br />') }}
                />

              </div>
            ) : (
               <div className="text-center py-8 text-muted-foreground">
                 <p>{isCompleted ? 'No se pudo generar el análisis.' : 'El análisis se generará automáticamente una vez que el cliente envíe sus respuestas.'}</p>
               </div>
            )}
          </CardContent>
           {isCompleted && analysis && (
            <CardFooter>
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
