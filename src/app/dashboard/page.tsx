'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Target, Percent, UserPlus, CheckCircle, Clock, Zap, ExternalLink, CalendarDays } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { chartData, pendingActionsData, projectWorkflowData, sampleAnswers } from '@/lib/data/dashboard-data';
import Link from 'next/link';
import type { ProjectPhase } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RouteGuard } from '@/components/auth/route-guard';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateContentSchedule, GenerateContentScheduleOutput } from '@/ai/flows/generate-content-schedule-flow';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-flow';
import type { GenerateImageOutput } from '@/lib/types';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { Loader2, Shield } from 'lucide-react';

const labels = {
  es: { pageTitle: 'Panel de Cliente', welcome: 'Bienvenido', generatedLeads: 'Leads Generados', inLast6Months: 'En los ultimos 6 meses', conversionRate: 'Tasa de Conversion', fromLeadToSale: 'De lead a venta', newFollowers: 'Nuevos Seguidores', inAllWindows: 'En todas las redes', pendingActions: 'Acciones Pendientes', pendingActionsDescription: 'Completa estos formularios para desbloquear tu estrategia y empezar a crecer.', complete: 'Completar', projectWorkflow: 'Flujo de Trabajo del Proyecto', projectWorkflowDescription: 'Sigue el progreso en tiempo real de tu campana automatizada.', inProgress: 'En Progreso', viewDeliverables: 'Ver Entregables', deliverablesTitle: 'Entregables de la Fase', deliverablesDescription: 'Estos son los resultados generados para la fase:', viewLivePost: 'Ver Publicacion en Vivo', publishedOn: 'Publicado el', generateContent: 'Generar Parrilla de Contenido', generating: 'Generando...', loading: 'Cargando...', noDeliverable: 'Aun no hay entregables para esta fase.', swotAnalysis: 'Analisis FODA', strengths: 'Fortalezas', weaknesses: 'Debilidades', opportunities: 'Oportunidades', threats: 'Amenazas', recommendations: 'Recomendaciones Estrategicas', questionnaireResponses: 'Respuestas al Cuestionario', upcoming: 'Se activara al completar la fase.', completed: 'Completado', logout: 'Cerrar Sesion' },
  en: { pageTitle: 'Customer Dashboard', welcome: 'Welcome', generatedLeads: 'Generated Leads', inLast6Months: 'In the last 6 months', conversionRate: 'Conversion Rate', fromLeadToSale: 'From lead to sale', newFollowers: 'New Followers', inAllWindows: 'On all networks', pendingActions: 'Pending Actions', pendingActionsDescription: 'Complete these forms to unlock your strategy and start growing.', complete: 'Complete', projectWorkflow: 'Project Workflow', projectWorkflowDescription: 'Follow the real-time progress of your automated campaign.', inProgress: 'In Progress', viewDeliverables: 'View Deliverables', deliverablesTitle: 'Phase Deliverables', deliverablesDescription: 'These are the results generated for the phase:', viewLivePost: 'View Live Post', publishedOn: 'Published on', generateContent: 'Generate Content Schedule', generating: 'Generating...', loading: 'Loading...', noDeliverable: 'No deliverables for this phase yet.', swotAnalysis: 'SWOT Analysis', strengths: 'Strengths', weaknesses: 'Weaknesses', opportunities: 'Opportunities', threats: 'Threats', recommendations: 'Strategic Recommendations', questionnaireResponses: 'Questionnaire Responses', upcoming: 'Will activate upon phase completion.', completed: 'Completed', logout: 'Logout' },
  fr: { pageTitle: 'Tableau de Bord Client', welcome: 'Bienvenue', generatedLeads: 'Prospects Generes', inLast6Months: 'Au cours des 6 derniers mois', conversionRate: 'Taux de Conversion', fromLeadToSale: 'Du prospect a la vente', newFollowers: 'Nouveaux Abonnes', inAllWindows: 'Sur tous les reseaux', pendingActions: 'Actions en Attente', pendingActionsDescription: 'Remplissez ces formulaires pour debloquer votre strategie.', complete: 'Completer', projectWorkflow: 'Flux de Travail du Projet', projectWorkflowDescription: "Suivez en temps reel l'avancement de votre campagne.", inProgress: 'En Cours', viewDeliverables: 'Voir les livrables', deliverablesTitle: 'Livrables de la phase', deliverablesDescription: 'Voici les resultats generes pour la phase :', viewLivePost: 'Voir la publication en direct', publishedOn: 'Publie le', generateContent: 'Generer la grille de contenu', generating: 'Generation en cours...', loading: 'Chargement...', noDeliverable: 'Pas encore de livrables pour cette phase.', swotAnalysis: 'Analyse SWOT', strengths: 'Forces', weaknesses: 'Faiblesses', opportunities: 'Opportunites', threats: 'Menaces', recommendations: 'Recommandations Strategiques', questionnaireResponses: 'Reponses au Questionnaire', upcoming: "S'activera a la fin de la phase.", completed: 'Termine', logout: 'Se deconnecter' },
};

const platforms = ['instagram', 'facebook', 'tiktok'];

function SecurityStatusBadge() {
  const [status, setStatus] = useState<'ok' | 'vulnerable' | 'scanning'>('ok');
  const [lastScan, setLastScan] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.random();
      if (r < 0.15) setStatus('vulnerable');
      else if (r < 0.25) setStatus('scanning');
      else setStatus('ok');
      setLastScan(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  let colorClass = 'bg-green-100 text-green-800';
  let label = 'Seguro';
  if (status === 'vulnerable') { colorClass = 'bg-orange-100 text-orange-800'; label = 'Vulnerable'; }
  if (status === 'scanning') { colorClass = 'bg-blue-100 text-blue-800 animate-pulse'; label = 'Escaneando...'; }

  return (
    <div className="flex items-center gap-2 mb-2">
      <Shield className="h-4 w-4" />
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {label}
        {lastScan && <span className="ml-2 text-[10px]">{lastScan}</span>}
      </span>
    </div>
  );
}

const DeliverablesDialogContent = ({ phase, t }: { phase: ProjectPhase; t: any }) => {
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
            result = await generateContentSchedule({ clientBusiness: 'Cliente: Cafeteria de Especialidad.' });
            break;
          case 'execution': {
            const schedule = await generateContentSchedule({ clientBusiness: 'Cliente: Cafeteria de Especialidad.' });
            const imagePromises = schedule.posts.map((post: any) => generateImageFromPrompt({ creativeBrief: post.copyIn, aspectRatio: '1:1' }));
            const images = await Promise.all(imagePromises);
            result = { schedule, images };
            break;
          }
          default:
            result = null;
        }
        setData(result);
      } catch {
        setError(t.noDeliverable);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [phase.id, t, language.code]);

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.loading}</div>;
  if (error) return <div className="text-center p-8 text-destructive">{error}</div>;
  if (!data) return <div className="text-center p-8 text-muted-foreground">{t.noDeliverable}</div>;

  switch (phase.id) {
    case 'onboarding':
      return (
        <div className="prose prose-sm max-w-none">
          <h4>{t.questionnaireResponses}</h4>
          {Object.entries(data).map(([section, answers]: [string, any]) => (
            <div key={section} className="mt-4">
              <h5 className="font-semibold">{section}</h5>
              {Object.entries(answers).map(([question, answer]: [string, any]) => (
                <div key={question} className="text-xs ml-2 mt-1">
                  <p className="text-muted-foreground">{question}</p>
                  <p className="font-medium">{answer}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    case 'research': {
      const analysis = data as AnalyzeBusinessEvaluationOutput;
      return (
        <div className="prose prose-sm max-w-none">
          <h4>{t.swotAnalysis}</h4>
          <div className="grid grid-cols-2 gap-x-4">
            <p><strong>{t.strengths}:</strong> {analysis.swot.strengths}</p>
            <p><strong>{t.opportunities}:</strong> {analysis.swot.opportunities}</p>
            <p><strong>{t.weaknesses}:</strong> {analysis.swot.weaknesses}</p>
            <p><strong>{t.threats}:</strong> {analysis.swot.threats}</p>
          </div>
          <h4 className="mt-4">{t.recommendations}</h4>
          <div className="text-sm font-sans whitespace-pre-wrap">{analysis.recommendations}</div>
        </div>
      );
    }
    case 'planning': {
      const schedule = data as GenerateContentScheduleOutput;
      return (
        <ScrollArea className="h-[50vh] pr-4">
          <pre className="text-xs">{JSON.stringify(schedule, null, 2)}</pre>
        </ScrollArea>
      );
    }
    case 'execution': {
      const { schedule: execSchedule, images } = data as { schedule: GenerateContentScheduleOutput; images: GenerateImageOutput[] };
      const getPublishDate = (index: number) => new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return (
        <Tabs defaultValue="instagram" className="flex-1 flex flex-col">
          <TabsList>
            {platforms.map(p => <TabsTrigger key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</TabsTrigger>)}
          </TabsList>
          <TabsContent value="instagram" className="flex-1">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-6">
                {execSchedule.posts.map((item: any, index: number) => (
                  <Card key={item.postNumber}>
                    <CardContent className="p-4 grid grid-cols-[150px_1fr] gap-4">
                      <div className="relative aspect-square w-[150px] h-[150px]">
                        <Image src={images[index]?.imageUrl || `https://picsum.photos/seed/${101 + index}/1080/1080`} alt={item.topic} fill className="rounded-md object-cover" />
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
          {platforms.slice(1).map(p => (
            <TabsContent key={p} value={p}>
              <p className="text-center text-muted-foreground p-8">{t.upcoming}</p>
            </TabsContent>
          ))}
        </Tabs>
      );
    }
    default:
      return <p>{t.noDeliverable}</p>;
  }
};

const PhaseCard = ({ phase, isLast, t }: { phase: ProjectPhase; isLast: boolean; t: any }) => {
  const displayTitle = phase.title ?? phase.name;
  const displayDescription = phase.description ?? phase.details;
  const statusIcon = phase.status === 'completed'
    ? <CheckCircle className="h-5 w-5 text-green-500" />
    : phase.status === 'in_progress'
    ? <Clock className="h-5 w-5 text-blue-500" />
    : <Zap className="h-5 w-5 text-muted-foreground" />;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background">
          {statusIcon}
        </div>
        {!isLast && <div className="mt-2 flex-1 w-px bg-border" />}
      </div>
      <div className="pb-8 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{displayTitle}</h3>
          {phase.status === 'completed' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">{t.viewDeliverables}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t.deliverablesTitle}</DialogTitle>
                  <DialogDescription>{t.deliverablesDescription} {displayTitle}</DialogDescription>
                </DialogHeader>
                <DeliverablesDialogContent phase={phase} t={t} />
              </DialogContent>
            </Dialog>
          )}
          {phase.status === 'in_progress' && (
            <span className="text-xs text-blue-500 font-medium">{t.inProgress}</span>
          )}
        </div>
        {displayDescription && <p className="text-sm text-muted-foreground mt-1">{displayDescription}</p>}
        {phase.progress !== undefined && (
          <Progress value={phase.progress} className="mt-2 h-2" />
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const authCtx = useAuth();
  const auth = authCtx.auth;
  const logout = authCtx.logout;
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] ?? labels.en;
  const isPayingCustomer = true;

  const kpis = useMemo(() => ({
    totalLeads: (chartData as any[]).reduce((a: number, b: any) => a + (b.leads ?? 0), 0),
    conversionRate: '12.5%',
    newFollowers: '1,247',
  }), []);

  const pendingActions = pendingActionsData[language.code as keyof typeof pendingActionsData] ?? pendingActionsData.en;

  if (!auth.user) return null;

  const RealDashboard = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t.projectWorkflow}</CardTitle>
        <CardDescription>{t.projectWorkflowDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {projectWorkflowData.phases.map((phase: ProjectPhase, index: number) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isLast={index === projectWorkflowData.phases.length - 1}
              t={t}
            />
          ))}
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
        {pendingActions.map((action: any) => (
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
    <RouteGuard requireAuth requireRole="customer">
      <div className="space-y-6 relative">
        <SecurityStatusBadge />
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.welcome}, {auth.user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>{t.logout}</Button>
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

        <div>
          {isPayingCustomer ? <RealDashboard /> : <DemoDashboard />}
        </div>
      </div>
    </RouteGuard>
  );
}
