
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CheckCircle, Clock, Search, Settings, User, Bot, Loader2, Zap, Image as ImageIcon, ExternalLink, ThumbsUp, RefreshCw, BarChart2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Project, ProjectPhase } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { sampleAnswers } from '@/lib/data/dashboard-data';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { generateContentSchedule, GenerateContentScheduleOutput, ContentPost } from '@/ai/flows/generate-content-schedule-flow';
import { generateImageFromPrompt, GenerateImageOutput } from '@/ai/flows/generate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';
import NextImage from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const initialProjects: Project[] = [
  {
    id: 'proj_001',
    customerId: 'cus_001',
    customerName: 'James Bond (Agente 007)',
    currentPhase: 'planning',
    status: 'Active',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'completed', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'in_progress', name: 'Planificación y Calendario' },
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

// --- SIMULATOR DIALOGS ---

const AnalysisReviewDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This component remains largely the same)
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
            toast({ title: "Análisis completado", description: "La IA ha generado el análisis FODA y las recomendaciones." });
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
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>
                        Revisando el cliente: {project.customerName}. Aquí puedes simular la ejecución de la IA y auditar la calidad del resultado.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[60vh] overflow-y-auto">
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

const ContentScheduleDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This component is now visually improved)
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<GenerateContentScheduleOutput | null>(null);
    const { toast } = useToast();

    const clientBusinessDescription = `Cliente: ${project.customerName}, Plan: Dúo Conexión VIP. Resumen: Cafetería de especialidad con producto estrella (cold brew) pero baja presencia de marca. Objetivo: Aumentar brand awareness y tráfico a tienda física.`;

    const handleRunGenerator = async () => {
        setIsLoading(true);
        setSchedule(null);
        try {
            const result = await generateContentSchedule({ clientBusiness: clientBusinessDescription });
            setSchedule(result);
            toast({ title: "Parrilla generada", description: "Se ha creado el calendario de contenido mensual." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error de Generación" });
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
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>Revisando el cliente: {project.customerName}. Simula la generación de la parrilla de contenido mensual.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Entrada: Perfil del Cliente e Instrucciones</h4>
                        <Card className="bg-muted/50"><CardContent className="p-4 text-xs font-mono">{clientBusinessDescription}</CardContent></Card>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Salida: Parrilla de Contenido Generada</h4>
                        <Card>
                            <CardHeader>
                                <Button onClick={handleRunGenerator} disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : <><Bot className="mr-2 h-4 w-4" /> Generar Parrilla</>}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isLoading && <p>La IA está creando el calendario...</p>}
                                {schedule && (
                                  <ScrollArea className="h-[400px] border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Formato</TableHead>
                                                <TableHead>Tema</TableHead>
                                                <TableHead>Copy</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schedule.posts.map(post => (
                                                <TableRow key={post.postNumber}>
                                                    <TableCell>{post.postNumber}</TableCell>
                                                    <TableCell>{post.format}</TableCell>
                                                    <TableCell>{post.topic}</TableCell>
                                                    <TableCell className="text-xs">{post.copyOut}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                  </ScrollArea>
                                )}
                            </CardContent>
                            {schedule && <CardFooter><Button className="w-full"><ThumbsUp className="mr-2"/>Guardar Parrilla Aprobada</Button></CardFooter>}
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const ImageGenerationDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This is the new image generation simulator)
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<GenerateContentScheduleOutput | null>(null);
    const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
    const [imageOutput, setImageOutput] = useState<GenerateImageOutput | null>(null);
    const { toast } = useToast();

    const getSchedule = async () => {
        if (schedule) return;
        setIsLoading(true);
        try {
            const result = await generateContentSchedule({ clientBusiness: `Cliente: ${project.customerName}` });
            setSchedule(result);
            if (result.posts.length > 0) setSelectedPost(result.posts[0]);
        } catch (error) {
            toast({ title: "Error al cargar la parrilla", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    const handleRunImageGenerator = async () => {
        if (!selectedPost) return;
        setIsLoading(true);
        setImageOutput(null);
        try {
            const result = await generateImageFromPrompt({ creativeBrief: selectedPost.copyIn, aspectRatio: '1:1' });
            setImageOutput(result);
            toast({ title: "Imagen generada con éxito" });
        } catch (error) {
            toast({ title: "Error al generar la imagen", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog onOpenChange={(open) => open && getSchedule()}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <ImageIcon className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>Genera una imagen para un post del cliente: {project.customerName}.</DialogDescription>
                </DialogHeader>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Entrada: Posts de la Parrilla</h4>
                        <Card className="bg-muted/50">
                            <CardContent className="p-2">
                                <ScrollArea className="h-64">
                                    <div className="space-y-2 p-2">
                                    {schedule?.posts.map(post => (
                                        <Button key={post.postNumber} variant={selectedPost?.postNumber === post.postNumber ? 'secondary' : 'ghost'} onClick={() => setSelectedPost(post)} className="w-full justify-start h-auto text-left">
                                            <div>
                                                <p className="font-semibold">Post #{post.postNumber}: {post.topic}</p>
                                                <p className="text-xs text-muted-foreground">{post.copyIn.substring(0, 50)}...</p>
                                            </div>
                                        </Button>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Salida: Imagen Generada por IA</h4>
                        <Card>
                            <CardHeader>
                                <Button onClick={handleRunImageGenerator} disabled={isLoading || !selectedPost}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : <><Bot className="mr-2 h-4 w-4" /> Generar Imagen para Post #{selectedPost?.postNumber}</>}
                                </Button>
                            </CardHeader>
                            <CardContent className="min-h-64 flex flex-col items-center justify-center text-center">
                                {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/> :
                                imageOutput?.imageUrl ? (
                                   <div className="space-y-2">
                                      <NextImage src={imageOutput.imageUrl || `https://picsum.photos/seed/${project.id}${selectedPost?.postNumber}/512`} alt="Generated image" width={256} height={256} className="rounded-lg border"/>
                                      <p className="text-xs text-muted-foreground max-w-xs mx-auto"><strong>Prompt usado:</strong> {imageOutput.refinedPrompt}</p>
                                   </div>
                                ) : <p className="text-sm text-muted-foreground">Selecciona un post y genera su imagen.</p>}
                            </CardContent>
                             {imageOutput && <CardFooter className="flex justify-center gap-2"><Button><ThumbsUp className="mr-2"/>Aprobar</Button><Button variant="outline"><RefreshCw className="mr-2"/>Regenerar</Button></CardFooter>}
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};

const OptimizationDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This is the new optimization simulator)
    const chartData = [ { month: 'A', conversion: 4.5 }, { month: 'B', conversion: 5.2 } ];
    const chartConfig = { conversion: { label: 'Conversión', color: 'hsl(var(--chart-1))' } } satisfies ChartConfig;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <BarChart2 className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>Simula el análisis de rendimiento de campaña y la generación de insights para {project.customerName}.</DialogDescription>
                </DialogHeader>
                 <div className="py-4 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Análisis de Performance (Simulado)</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 text-center">
                            <div><p className="text-2xl font-bold">120,450</p><p className="text-xs text-muted-foreground">Impresiones</p></div>
                            <div><p className="text-2xl font-bold">3,612</p><p className="text-xs text-muted-foreground">Clics</p></div>
                            <div><p className="text-2xl font-bold">3.0%</p><p className="text-xs text-muted-foreground">CTR</p></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-base">Simulación de Prueba A/B</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-semibold">Copy A: "Descubre nuestro Cold Brew artesanal." - <Badge variant="destructive">Perdedor (4.5% CVR)</Badge></div>
                                <div className="text-sm font-semibold">Copy B: "El Cold Brew que te cambiará la vida. ¡Pruébalo hoy!" - <Badge className="bg-green-500 text-white">Ganador (5.2% CVR)</Badge></div>
                            </div>
                            <ChartContainer config={chartConfig} className="h-[100px] w-full">
                                <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <XAxis type="number" dataKey="conversion" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="conversion" layout="vertical" radius={5}>
                                         {chartData.map((_, index) => <NextImage key={index} fill={index === 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"} />)}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-base">Insights y Recomendaciones de IA</CardTitle></CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>**Optimizar:** Incrementar presupuesto en campañas de video, mostraron 15% más engagement.</li>
                                <li>**Enfocar:** El segmento de 25-34 años tuvo la tasa de conversión más alta. Crear audiencia lookalike.</li>
                                <li>**Sugerencia:** Lanzar promoción de "2x1 en Cold Brew" los fines de semana para capitalizar el tráfico.</li>
                            </ul>
                        </CardContent>
                    </Card>
                 </div>
            </DialogContent>
        </Dialog>
    )
};


const PhaseCard = ({ project, phase, isCurrent, isCompleted }: { project: Project, phase: ProjectPhase, isCurrent: boolean, isCompleted: boolean }) => {
    
    const isSimulatorClient = project.customerName.includes("James Bond");

    const getIcon = () => {
        if(isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if(isCurrent) return <Zap className="h-5 w-5 text-orange-500 animate-pulse" />;
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }

    const progressValue = isCompleted ? 100 : isCurrent ? 50 : 0;
    
    const renderAction = () => {
        if (!isSimulatorClient) {
            return (
                <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground" disabled>
                    <Settings className="mr-2 h-3 w-3" /> Ver Detalles (Auto)
                </Button>
            )
        }
        
        switch(phase.id) {
            case 'research':
                return <AnalysisReviewDialog project={project} phase={phase} />;
            case 'planning':
                return <ContentScheduleDialog project={project} phase={phase} />;
            case 'execution':
                return <ImageGenerationDialog project={project} phase={phase} />;
             case 'closure':
                return <OptimizationDialog project={project} phase={phase} />;
            default:
                 return (
                    <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground" disabled>
                        <Settings className="mr-2 h-3 w-3" /> Próximamente
                    </Button>
                 )
        }
    }


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
                        <Progress value={progressValue} className="h-1" indicatorClassName="bg-orange-500" />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 {renderAction()}
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

