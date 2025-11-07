
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CheckCircle, Clock, Search, Settings, User, Bot, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Project, ProjectPhase } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { sampleAnswers } from '@/lib/data/dashboard-data';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

const initialProjects: Project[] = [
  {
    id: 'proj_001',
    customerId: 'cus_001',
    customerName: 'James Bond (Agente 007)',
    currentPhase: 'research',
    status: 'Active',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'in_progress', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'pending', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'pending', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  },
  {
    id: 'proj_002',
    customerId: 'cus_002',
    customerName: 'Jane Smith (demo@cliente.com)',
    currentPhase: 'execution',
    status: 'Active',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'completed', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'completed', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'in_progress', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  },
  {
    id: 'proj_004',
    customerId: 'cus_004',
    customerName: 'Emily Brown (emily.b@example.com)',
    currentPhase: 'onboarding',
    status: 'Suspended',
     phases: [
      { id: 'onboarding', status: 'pending', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'pending', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'pending', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'pending', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  }
];

const AnalysisReviewDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalyzeBusinessEvaluationOutput | null>(null);
    const { toast } = useToast();
    const { language } = useLanguage();

    const handleRunAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzeBusinessEvaluation({ 
                answersJson: JSON.stringify(sampleAnswers.eval),
                targetLanguage: language.code,
            });
            setAnalysis(result);
        } catch (error) {
            console.error("Analysis failed", error);
            toast({
              variant: "destructive",
              title: "Error de Análisis",
              description: "La IA no pudo procesar las respuestas.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <Bot className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>
                        Revisando el cliente: {project.customerName}. Aquí puedes simular la ejecución de la IA y auditar la calidad del resultado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 py-4 max-h-[60vh] overflow-y-auto">
                    {/* Input Data */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Entrada: Respuestas del Cuestionario (Ejemplo)</h4>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 space-y-4 text-sm">
                                {Object.entries(sampleAnswers.eval).map(([section, answers]: [string, any]) => (
                                <div key={section}>
                                    <h5 className="font-semibold mb-1">{section}</h5>
                                    {Object.entries(answers).map(([question, answer]: [string, any]) => (
                                    <div key={question} className="text-xs">
                                        <p className="text-muted-foreground">{question}</p>
                                        <p className="font-medium pl-2">{answer}</p>
                                    </div>
                                    ))}
                                </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI Output */}
                    <div className="space-y-4">
                         <h4 className="font-semibold">Salida: Análisis de IA</h4>
                        <Card>
                            <CardHeader>
                                <Button onClick={handleRunAnalysis} disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analizando...</> : <><Bot className="mr-2 h-4 w-4" /> Ejecutar Análisis de Negocio</>}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isLoading && <p className="text-sm text-muted-foreground">La IA está trabajando...</p>}
                                {analysis && (
                                    <div className="prose prose-sm max-w-none">
                                        <h4>Análisis FODA</h4>
                                        <p><strong>Fortalezas:</strong> {analysis.swot.strengths}</p>
                                        <p><strong>Debilidades:</strong> {analysis.swot.weaknesses}</p>
                                        <p><strong>Oportunidades:</strong> {analysis.swot.opportunities}</p>
                                        <p><strong>Amenazas:</strong> {analysis.swot.threats}</p>
                                        <h4 className="mt-4">Recomendaciones Estratégicas</h4>
                                        <p className="whitespace-pre-wrap">{analysis.recommendations}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


const PhaseCard = ({ project, phase, isCurrent, isCompleted }: { project: Project, phase: ProjectPhase, isCurrent: boolean, isCompleted: boolean }) => {
    
    const isSimulatorClient = project.customerName.includes("James Bond");

    const getIcon = () => {
        if(isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if(isCurrent) return <Zap className="h-5 w-5 text-orange-500" />;
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }

    const progressValue = isCompleted ? 100 : isCurrent ? 50 : 0;

    return (
        <Card className={cn('transition-all w-full', { 'border-primary shadow-lg': isCurrent, 'bg-muted/30': isCompleted, 'border-dashed': !isCurrent && !isCompleted })}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">{phase.name}</CardTitle>
                {getIcon()}
            </CardHeader>
            <CardContent>
                 <p className="text-xs text-muted-foreground">
                    {isCompleted ? 'Completado' : isCurrent ? 'En progreso...' : 'Pendiente'}
                </p>
                 {isCurrent && (
                     <div className="mt-2 space-y-1">
                        <Progress value={progressValue} className="h-1" indicatorClassName="bg-orange-500 animate-pulse" />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 {(isSimulatorClient && phase.id === 'research') ? (
                    <AnalysisReviewDialog project={project} phase={phase} />
                 ) : (
                    <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground" disabled={!isCurrent && !isCompleted}>
                        <Settings className="mr-2 h-3 w-3" /> Ver Detalles
                    </Button>
                 )}
            </CardFooter>
        </Card>
    )
}


export default function TeamLabPage() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return initialProjects;
        return initialProjects.filter(p => p.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const getStatusBadgeVariant = (status: Project['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'Active': return 'default';
            case 'Suspended': return 'secondary';
            case 'Canceled': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Beaker className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline">Team Lab: Supervisión de Proyectos</h1>
                </div>
                <p className="text-muted-foreground">
                    Supervisa el flujo de trabajo automatizado de cada cliente. Usa a "James Bond" para simular y validar las tareas de la IA.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Lista de Clientes y Proyectos</CardTitle>
                    <CardDescription>
                        Busca un cliente y expande para ver el estado de su flujo de trabajo.
                    </CardDescription>
                    <div className="relative pt-4">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre de cliente..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Accordion type="multiple" className="w-full">
                       {filteredProjects.map(project => (
                           <AccordionItem value={project.id} key={project.id}>
                               <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 text-left">
                                   <div className="flex items-center gap-4">
                                     <Badge variant={getStatusBadgeVariant(project.status)} className={project.status === 'Active' ? 'bg-green-600/80 text-white' : ''}>{project.status}</Badge>
                                     <div className="flex flex-col">
                                        <span className="font-semibold">{project.customerName}</span>
                                        <span className="text-xs text-muted-foreground">Proyecto ID: {project.id}</span>
                                     </div>
                                   </div>
                               </AccordionTrigger>
                               <AccordionContent className="bg-muted/20 p-4">
                                  <div className="overflow-x-auto">
                                      <div className="flex items-start gap-4 pb-4">
                                          {project.phases.map((phase) => (
                                             <div key={phase.id} className="min-w-[240px]">
                                               <PhaseCard 
                                                  project={project}
                                                  phase={phase}
                                                  isCurrent={phase.id === project.currentPhase}
                                                  isCompleted={phase.status === 'completed'}
                                              />
                                             </div>
                                          ))}
                                      </div>
                                  </div>
                               </AccordionContent>
                           </AccordionItem>
                       ))}
                    </Accordion>
                     {filteredProjects.length === 0 && (
                        <div className="p-6 text-center text-muted-foreground">
                            No se encontraron clientes con ese nombre.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
