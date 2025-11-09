
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Target, Percent, UserPlus, CheckCircle, Clock, Zap, ArrowRight, ExternalLink, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { chartData, pendingActionsData, projectWorkflowData, sampleAnswers } from '@/lib/data/dashboard-data';
import Link from 'next/link';
import type { ProjectPhase, ContentPost } from '@/lib/types';
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
import { Loader2 } from 'lucide-react';


const labels = {
  es: { pageTitle: 'Panel de Cliente', welcome: 'Bienvenido', generatedLeads: 'Leads Generados', inLast6Months: 'En los últimos 6 meses', conversionRate: 'Tasa de Conversión', fromLeadToSale: 'De lead a venta', newFollowers: 'Nuevos Seguidores', inAllWindows: 'En todas las redes', pendingActions: 'Acciones Pendientes', pendingActionsDescription: 'Completa estos formularios para desbloquear tu estrategia y empezar a crecer.', complete: 'Completar', projectWorkflow: 'Flujo de Trabajo del Proyecto', projectWorkflowDescription: 'Sigue el progreso en tiempo real de tu campaña automatizada.', inProgress: "En Progreso", viewDeliverables: 'Ver Entregables', deliverablesTitle: 'Entregables de la Campaña', deliverablesDescription: 'Filtra por plataforma para ver el contenido generado y publicado en tus redes.', viewLivePost: 'Ver Publicación en Vivo', publishedOn: 'Publicado el', generateContent: 'Generar Parrilla de Contenido', generating: 'Generando...' },
  en: { pageTitle: 'Customer Dashboard', welcome: 'Welcome', generatedLeads: 'Generated Leads', inLast6Months: 'In the last 6 months', conversionRate: 'Conversion Rate', fromLeadToSale: 'From lead to sale', newFollowers: 'New Followers', inAllWindows: 'On all networks', pendingActions: 'Pending Actions', pendingActionsDescription: 'Complete these forms to unlock your strategy and start growing.', complete: 'Complete', projectWorkflow: 'Project Workflow', projectWorkflowDescription: 'Follow the real-time progress of your automated campaign.', inProgress: "In Progress", viewDeliverables: 'View Deliverables', deliverablesTitle: 'Campaign Deliverables', deliverablesDescription: 'Filter by platform to see the content generated and published on your networks.', viewLivePost: 'View Live Post', publishedOn: 'Published on', generateContent: 'Generate Content Schedule', generating: 'Generating...' },
  fr: { pageTitle: 'Tableau de Bord Client', welcome: 'Bienvenue', generatedLeads: 'Prospects Générés', inLast6Months: 'Au cours des 6 derniers mois', conversionRate: 'Taux de Conversion', fromLeadToSale: 'Du prospect à la vente', newFollowers: 'Nouveaux Abonnés', inAllWindows: 'Sur tous les réseaux', pendingActions: 'Actions en Attente', pendingActionsDescription: 'Remplissez ces formulaires pour débloquer votre stratégie et commencer à grandir.', complete: 'Compléter', projectWorkflow: 'Flux de Travail du Projet', projectWorkflowDescription: 'Suivez en temps réel l\'avancement de votre campagne automatisée.', inProgress: "En Cours", viewDeliverables: 'Voir les livrables', deliverablesTitle: 'Livrables de la campagne', deliverablesDescription: 'Filtrez par plateforme pour voir le contenu généré et publié sur vos réseaux.', viewLivePost: 'Voir la publication en direct', publishedOn: 'Publié le', generateContent: 'Générer la grille de contenu', generating: 'Génération en cours...' }
};

const platforms = ['instagram', 'facebook', 'tiktok'];

const DeliverablesDialog = ({ t }: { t: typeof labels['en'] }) => {
    const [schedule, setSchedule] = useState<GenerateContentScheduleOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateContent = async () => {
        setIsLoading(true);
        try {
            const result = await generateContentSchedule({ 
                clientBusiness: "Cliente: Cafetería de Especialidad. Análisis: Fuerte producto pero baja presencia de marca. Instrucciones: Aumentar brand awareness.",
            });
            setSchedule(result);
        } catch (error) {
            toast({ title: t.deliverablesTitle, description: "Error al generar la parrilla de contenido.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
    
    // Use simulated date
    const getPublishDate = (index: number) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        return date.toISOString().split('T')[0];
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-2" size="sm">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {t.viewDeliverables}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t.deliverablesTitle}</DialogTitle>
                    <DialogDescription>{t.deliverablesDescription}</DialogDescription>
                </DialogHeader>
                 {!schedule ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <p className="text-muted-foreground">No se ha generado ninguna parrilla de contenido todavía.</p>
                         <Button onClick={handleGenerateContent} disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t.generating}</> : t.generateContent}
                        </Button>
                    </div>
                ) : (
                    <Tabs defaultValue="instagram" className="flex-1 flex flex-col overflow-hidden">
                        <TabsList>
                            {platforms.map(p => <TabsTrigger key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</TabsTrigger>)}
                        </TabsList>
                        {platforms.map(p => (
                             <TabsContent key={p} value={p} className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full pr-6">
                                    <div className="space-y-6">
                                        {schedule.posts.map((item, index) => (
                                            <Card key={item.postNumber}>
                                                <CardContent className="p-4 grid grid-cols-[150px_1fr] gap-4">
                                                    <div className="relative aspect-square w-[150px] h-[150px]">
                                                      <Image src={`https://picsum.photos/seed/${101 + index}/1080/1080`} alt={item.topic} fill className="rounded-md object-cover"/>
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
                        ))}
                    </Tabs>
                 )}
            </DialogContent>
        </Dialog>
    )
}


const PhaseCard = ({ phase, isLast, t }: { phase: ProjectPhase, isLast: boolean, t: typeof labels['en'] }) => {
    
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
                {!isLast && <div className="mt-2 h-24 w-px bg-border" />}
            </div>
            <div className="pt-2 flex-1">
                <h4 className="font-semibold">{phase.name}</h4>
                <p className="text-sm text-muted-foreground">{phase.details}</p>
                 {phase.status === 'in_progress' && (
                    <div className="mt-2 space-y-1">
                        <span className="text-xs font-semibold text-orange-600">{t.inProgress}...</span>
                        <Progress value={50} className="h-1 [&>*]:bg-orange-500" />
                    </div>
                )}
                 {phase.id === 'execution' && (
                    <DeliverablesDialog t={t} />
                )}
            </div>
        </div>
    )
}


export default function DashboardPage() {
  const { auth } = useAuth();
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
            {projectWorkflowData.phases.map((phase, index) => (
                <PhaseCard 
                    key={phase.id} 
                    phase={phase} 
                    isLast={index === projectWorkflowData.phases.length - 1} 
                    t={t}
                />
            ))}
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.welcome}, {auth.user?.email}</p>
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
