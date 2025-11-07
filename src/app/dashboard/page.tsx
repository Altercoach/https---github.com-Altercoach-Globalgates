
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Target, Percent, UserPlus, CheckCircle, Clock, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { chartData, pendingActionsData, projectWorkflowData } from '@/lib/data/dashboard-data';
import Link from 'next/link';
import type { ProjectPhase } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

const labels = {
  es: { pageTitle: 'Panel de Cliente', welcome: 'Bienvenido', generatedLeads: 'Leads Generados', inLast6Months: 'En los últimos 6 meses', conversionRate: 'Tasa de Conversión', fromLeadToSale: 'De lead a venta', newFollowers: 'Nuevos Seguidores', inAllWindows: 'En todas las redes', pendingActions: 'Acciones Pendientes', pendingActionsDescription: 'Completa estos formularios para desbloquear tu estrategia y empezar a crecer.', complete: 'Completar', projectWorkflow: 'Flujo de Trabajo del Proyecto', projectWorkflowDescription: 'Sigue el progreso en tiempo real de tu campaña automatizada.', inProgress: "En Progreso", viewDeliverables: 'Ver Entregables', deliverablesTitle: 'Entregables de la Campaña', deliverablesDescription: 'Aquí puedes ver el contenido generado y publicado en tus redes.', viewLivePost: 'Ver Publicación en Vivo' },
  en: { pageTitle: 'Customer Dashboard', welcome: 'Welcome', generatedLeads: 'Generated Leads', inLast6Months: 'In the last 6 months', conversionRate: 'Conversion Rate', fromLeadToSale: 'From lead to sale', newFollowers: 'New Followers', inAllWindows: 'On all networks', pendingActions: 'Pending Actions', pendingActionsDescription: 'Complete these forms to unlock your strategy and start growing.', complete: 'Complete', projectWorkflow: 'Project Workflow', projectWorkflowDescription: 'Follow the real-time progress of your automated campaign.', inProgress: "In Progress", viewDeliverables: 'View Deliverables', deliverablesTitle: 'Campaign Deliverables', deliverablesDescription: 'Here you can see the content generated and published on your networks.', viewLivePost: 'View Live Post' },
  fr: { pageTitle: 'Tableau de Bord Client', welcome: 'Bienvenue', generatedLeads: 'Prospects Générés', inLast6Months: 'Au cours des 6 derniers mois', conversionRate: 'Taux de Conversion', fromLeadToSale: 'Du prospect à la vente', newFollowers: 'Nouveaux Abonnés', inAllWindows: 'Sur tous les réseaux', pendingActions: 'Actions en Attente', pendingActionsDescription: 'Remplissez ces formulaires pour débloquer votre stratégie et commencer à grandir.', complete: 'Compléter', projectWorkflow: 'Flux de Travail du Projet', projectWorkflowDescription: 'Suivez en temps réel l\'avancement de votre campagne automatisée.', inProgress: "En Cours", viewDeliverables: 'Voir les livrables', deliverablesTitle: 'Livrables de la campagne', deliverablesDescription: 'Ici, vous pouvez voir le contenu généré et publié sur vos réseaux.', viewLivePost: 'Voir la publication en direct' }
};

const mockDeliverables = Array.from({ length: 15 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Publicación ${i + 1}: Tópico de Branding`,
    copy: "Este es el copy generado por la IA para la publicación. Es atractivo, persuasivo y utiliza hashtags relevantes. #MarketingDigital #Crecimiento #IA",
    imageUrl: `https://picsum.photos/seed/${100 + i}/1080/1080`,
    liveUrl: 'https://instagram.com'
}));

const PhaseCard = ({ phase, isLast }: { phase: ProjectPhase, isLast: boolean }) => {
    const { language } = useLanguage();
    const t = labels[language.code as keyof typeof labels] || labels.en;
    
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
                 {phase.status === 'completed' && phase.id === 'execution' && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mt-2" size="sm">
                                <ArrowRight className="mr-2 h-4 w-4" />
                                {t.viewDeliverables}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl h-[90vh]">
                             <DialogHeader>
                                <DialogTitle>{t.deliverablesTitle}</DialogTitle>
                                <DialogDescription>{t.deliverablesDescription}</DialogDescription>
                            </DialogHeader>
                             <ScrollArea className="h-full">
                                <div className="space-y-6 pr-6">
                                    {mockDeliverables.map(item => (
                                        <Card key={item.id}>
                                            <CardContent className="p-4 grid grid-cols-[150px_1fr] gap-4">
                                                <Image src={item.imageUrl} alt={item.title} width={150} height={150} className="rounded-md object-cover aspect-square"/>
                                                <div className="space-y-2">
                                                    <h5 className="font-semibold">{item.title}</h5>
                                                    <p className="text-sm text-muted-foreground">{item.copy}</p>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={item.liveUrl} target="_blank">
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
                        </DialogContent>
                    </Dialog>
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

    