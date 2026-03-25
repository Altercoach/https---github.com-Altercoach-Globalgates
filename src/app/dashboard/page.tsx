
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Target, Percent, UserPlus, CheckCircle, Clock, Zap, ArrowRight, ExternalLink, CalendarDays, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { chartData, pendingActionsData, projectWorkflowData, sampleAnswers } from '@/lib/data/dashboard-data';
import Link from 'next/link';
import type { ProjectPhase, ContentPost, Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { generateContentSchedule, GenerateContentScheduleOutput } from '@/ai/flows/generate-content-schedule-flow';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-flow';
import type { GenerateImageOutput } from '@/lib/types';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { Loader2 } from 'lucide-react';


const labels = {
  es: { pageTitle: 'Panel de Cliente', welcome: 'Bienvenido', generatedLeads: 'Leads Generados', inLast6Months: 'En los últimos 6 meses', conversionRate: 'Tasa de Conversión', fromLeadToSale: 'De lead a venta', newFollowers: 'Nuevos Seguidores', inAllWindows: 'En todas las redes', pendingActions: 'Acciones Pendientes', pendingActionsDescription: 'Completa estos formularios para desbloquear tu estrategia y empezar a crecer.', complete: 'Completar', projectWorkflow: 'Flujo de Trabajo del Proyecto', projectWorkflowDescription: 'Sigue el progreso en tiempo real de tu campaña automatizada.', inProgress: "En Progreso", viewDeliverables: 'Ver Entregables', deliverablesTitle: 'Entregables de la Fase', deliverablesDescription: 'Estos son los resultados generados para la fase:', viewLivePost: 'Ver Publicación en Vivo', publishedOn: 'Publicado el', generateContent: 'Generar Parrilla de Contenido', generating: 'Generando...', loading: 'Cargando...', noDeliverable: 'Aún no hay entregables para esta fase.', swotAnalysis: "Análisis FODA", strengths: "Fortalezas", weaknesses: "Debilidades", opportunities: "Oportunidades", threats: "Amenazas", recommendations: "Recomendaciones Estratégicas", questionnaireResponses: "Respuestas al Cuestionario", upcoming: "Se activará al completar la fase.", completed: "Completado" },
  en: { pageTitle: 'Customer Dashboard', welcome: 'Welcome', generatedLeads: 'Generated Leads', inLast6Months: 'In the last 6 months', conversionRate: 'Conversion Rate', fromLeadToSale: 'From lead to sale', newFollowers: 'New Followers', inAllWindows: 'On all networks', pendingActions: 'Pending Actions', pendingActionsDescription: 'Complete these forms to unlock your strategy and start growing.', complete: 'Complete', projectWorkflow: 'Project Workflow', projectWorkflowDescription: 'Follow the real-time progress of your automated campaign.', inProgress: "In Progress", viewDeliverables: 'View Deliverables', deliverablesTitle: 'Phase Deliverables', deliverablesDescription: 'These are the results generated for the phase:', viewLivePost: 'View Live Post', publishedOn: 'Published on', generateContent: 'Generate Content Schedule', generating: 'Generating...', loading: 'Loading...', noDeliverable: 'No deliverables for this phase yet.', swotAnalysis: "SWOT Analysis", strengths: "Strengths", weaknesses: "Weaknesses", opportunities: "Opportunities", threats: "Threats", recommendations: "Strategic Recommendations", questionnaireResponses: "Questionnaire Responses", upcoming: "Will activate upon phase completion.", completed: "Completed" },
  fr: { pageTitle: 'Tableau de Bord Client', welcome: 'Bienvenue', generatedLeads: 'Prospects Générés', inLast6Months: 'Au cours des 6 derniers mois', conversionRate: 'Taux de Conversion', fromLeadToSale: 'Du prospect à la vente', newFollowers: 'Nouveaux Abonnés', inAllWindows: 'Sur tous les réseaux', pendingActions: 'Actions en Attente', pendingActionsDescription: 'Remplissez ces formulaires pour débloquer votre stratégie et commencer à grandir.', complete: 'Compléter', projectWorkflow: 'Flux de Travail du Projet', projectWorkflowDescription: 'Suivez en temps réel l\'avancement de votre campagne automatisée.', inProgress: "En Cours", viewDeliverables: 'Voir les livrables', deliverablesTitle: 'Livrables de la phase', deliverablesDescription: 'Voici les résultats générés pour la phase :', viewLivePost: 'Voir la publication en direct', publishedOn: 'Publié le', generateContent: 'Générer la grille de contenu', generating: 'Génération en cours...', loading: 'Chargement...', noDeliverable: 'Pas encore de livrables pour cette phase.', swotAnalysis: "Analyse SWOT", strengths: "Forces", weaknesses: "Faiblesses", opportunities: "Opportunités", threats: "Menaces", recommendations: "Recommandations Stratégiques", questionnaireResponses: "Réponses au Questionnaire", upcoming: "S'activera à la fin de la phase.", completed: "Terminé" }
};

const platforms = ['instagram', 'facebook', 'tiktok'];

const DeliverablesDialogContent = ({ phase, t }: { phase: ProjectPhase, t: any }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let result;
                switch (phase.id) {
                    case 'onboarding':
                        result = sampleAnswers.eval;
                        break;
                    case 'research':
                        result = await analyzeBusinessEvaluation({ answersJson: JSON.stringify(sampleAnswers.eval), targetLanguage: language.code });
                        break;
                    case 'planning':
                        result = await generateContentSchedule({ clientBusiness: "Cliente: Cafetería de Especialidad. Análisis: Fuerte producto pero baja presencia de marca." });
                        break;
                    case 'execution':
                         const schedule = await generateContentSchedule({ clientBusiness: "Cliente: Cafetería de Especialidad." });
                         const imagePromises = schedule.posts.map(post => 
                             generateImageFromPrompt({ creativeBrief: post.copyIn })
                         );
                         const images = await Promise.all(imagePromises);
                         result = { schedule, images };
                        break;
                    default:
                        result = null;
                }
                setData(result);
            } catch (err) {
                setError(t.noDeliverable);
                console.error("Failed to fetch deliverable:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [phase.id, t, language.code]);

    if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t.loading}</div>;
    if (error) return <div className="text-center p-8 text-destructive">{error}</div>;
    if (!data) return <div className="text-center p-8 text-muted-foreground">{t.noDeliverable}</div>;

    switch (phase.id) {
        case 'onboarding':
            return (
                <div className="prose prose-sm max-w-none">
                    <h4>{t.questionnaireResponses}</h4>
                    {Object.entries(data).map(([section, answers]: [string, any]) => (
                        <div key={section} className="mt-4">
                        <h5 className='font-semibold'>{section}</h5>
                        {Object.entries(answers).map(([question, answer]: [string, any]) => (
                            <div key={question} className="text-xs ml-2 mt-1">
                                <p className="text-muted-foreground">{question}</p>
                                <p className="font-medium">{answer}</p>
                            </div>
                        ))}
                        </div>
                    ))}
                </div>
            )
        case 'research':
            const analysis = data as AnalyzeBusinessEvaluationOutput;
            return (
                 <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                    <h4>{t.swotAnalysis}</h4>
                    <div className="grid grid-cols-2 gap-x-4">
                        <p><strong>{t.strengths}:</strong> {analysis.swot.strengths}</p>
                        <p><strong>{t.opportunities}:</strong> {analysis.swot.opportunities}</p>
                        <p><strong>{t.weaknesses}:</strong> {analysis.swot.weaknesses}</p>
                        <p><strong>{t.threats}:</strong> {analysis.swot.threats}</p>
                    </div>
                    <h4 className="mt-4">{t.recommendations}</h4>
                    <div className="text-sm font-sans whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: analysis.recommendations.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
            )
        case 'planning':
            const schedule = data as GenerateContentScheduleOutput;
             return (
                <ScrollArea className="h-[50vh] pr-4">
                  <div className="prose prose-sm max-w-none">
                      <pre>{JSON.stringify(schedule, null, 2)}</pre>
                  </div>
                </ScrollArea>
            )
        case 'execution':
            const { schedule: execSchedule, images } = data as { schedule: GenerateContentScheduleOutput, images: GenerateImageOutput[] };
            const getPublishDate = (index: number) => new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return (
                <Tabs defaultValue="instagram" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList>
                        {platforms.map(p => <TabsTrigger key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</TabsTrigger>)}
                    </TabsList>
                     <TabsContent value="instagram" className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-6">
                            <div className="space-y-6">
                                {execSchedule.posts.map((item, index) => (
                                    <Card key={item.postNumber}>
                                        <CardContent className="p-4 grid grid-cols-[150px_1fr] gap-4">
                                            <div className="relative aspect-square w-[150px] h-[150px]">
                                              <Image src={images[index]?.imageUrl || `https://picsum.photos/seed/${101 + index}/1080/1080`} alt={item.topic} fill className="rounded-md object-cover"/>
                                            </div>
                                            <div className="space-y-2">
                                                <h5 className="font-semibold">{item.format}: {item.topic}</h5>
                                                <p className="text-sm text-muted-foreground">{item.copyOut}</p>
                                                 <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                                                    <CalendarDays className="h-3 w-3" />
                                                    {t.publishedOn} {getPublishDate(index)}
                                                </p>
                                                <Button asChild variant="outline" size="sm" className="mt-2">
                                                    <Link href="https://instagram.com" target="_blank">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        {t.viewLivePost}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            )
        default: return <p>{t.noDeliverable}</p>;
    }
};

const PhaseCard = ({ phase, t }: { phase: ProjectPhase, isLast: boolean, t: any }) => {
    
    const getIcon = () => {
        if(phase.status === 'completed') return <CheckCircle className="h-6 w-6 text-green-500" />;
        if(phase.status === 'in_progress') return <Zap className="h-6 w-6 text-orange-500" />;
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }

    return (
       <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", {
                    'bg-green-100 dark:bg-green-900/50': phase.status === 'completed',
                    'bg-orange-100 dark:bg-orange-900/50': phase.status === 'in_progress',
                    'bg-muted': phase.status === 'pending'
                })}>
                    {getIcon()}
                </div>
            </div>
            <div className="pt-2 flex-1">
                <h4 className="font-semibold">{phase.name}</h4>
                <p className="text-sm text-muted-foreground">{phase.details || (phase.status === 'completed' ? t.completed : t.upcoming)}</p>
                 {phase.status === 'in_progress' && (
                    <div className="mt-2 space-y-1">
                        <span className="text-xs font-semibold text-orange-600">{t.inProgress}...</span>
                        <Progress value={50} className="h-1 [&>*]:bg-orange-500" />
                    </div>
                )}
                 <Dialog>
                    <DialogTrigger asChild>
                       <Button className="mt-2 w-full justify-start" size="sm" variant="outline" disabled={phase.status !== 'completed'}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            {t.viewDeliverables}
                        </Button>
                    </DialogTrigger>
                     {phase.status === 'completed' && (
                        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle>{t.deliverablesTitle}: {phase.name}</DialogTitle>
                                <DialogDescription>{t.deliverablesDescription}</DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-auto">
                               <DeliverablesDialogContent phase={phase} t={t}/>
                            </div>
                        </DialogContent>
                     )}
                </Dialog>
            </div>
        </div>
    )
}


export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const isPayingCustomer = auth.user?.email === 'demo@cliente.com';

  const pendingActions = pendingActionsData[language.code as keyof typeof pendingActionsData] || pendingActionsData.en;
  
  useEffect(() => {
    if (auth.isMounted && auth.user?.role !== 'customer') {
      router.push('/login');
    }
  }, [auth, router]);

  const kpis = useMemo(() => {
    const totalLeads = chartData.reduce((acc, item) => acc + item.leads, 0);
    const totalClosed = chartData.reduce((acc, item) => acc + item.closed, 0);
    const conversionRate = totalLeads > 0 ? (totalClosed / totalLeads) * 100 : 0;
    return {
      totalLeads,
      conversionRate: `${conversionRate.toFixed(1)}%`,
      newFollowers: '1,2K', // Mock data
    }
  }, []);

  if (!auth.user) {
    return null; // The layout will handle the redirect message
  }

  const RealDashboard = () => (
     <Card>
        <CardHeader>
            <CardTitle>{t.projectWorkflow}</CardTitle>
            <CardDescription>{t.projectWorkflowDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[35px] top-12 bottom-12 w-px bg-border -translate-x-1/2"></div>
                
                <div className="space-y-8">
                     {projectWorkflowData.phases.map((phase, index) => (
                        <PhaseCard 
                            key={phase.id} 
                            phase={phase} 
                            isLast={index === projectWorkflowData.phases.length - 1} 
                            t={t}
                        />
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
  );

  const DemoDashboard = () => (
     <Card>
        <CardHeader>
            <CardTitle>{t.pendingActions}</CardTitle>
            <CardDescription>{t.pendingActionsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {pendingActions.map(action => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                      <h4 className="font-semibold">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <Button asChild size="sm">
                      <Link href={action.href}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t.complete}
                      </Link>
                  </Button>
              </div>
            ))}
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.welcome}, {auth.user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.generatedLeads}</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.totalLeads}</div>
                    <p className="text-xs text-muted-foreground">{t.inLast6Months}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.conversionRate}</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.conversionRate}</div>
                    <p className="text-xs text-muted-foreground">{t.fromLeadToSale}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.newFollowers}</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.newFollowers}</div>
                    <p className="text-xs text-muted-foreground">{t.inAllWindows}</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-1">
          <div className="space-y-6">
             {isPayingCustomer ? <RealDashboard/> : <DemoDashboard/>}
          </div>
        </div>
    </div>
  );
}
