
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, BarChart, FileText, ShoppingBag, Edit, CheckCircle, Target, Percent, UserPlus, Bot, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { useLanguage } from '@/hooks/use-language';

const chartData = [
  { month: "Enero", leads: 186, closed: 20 },
  { month: "Febrero", leads: 305, closed: 35 },
  { month: "Marzo", leads: 237, closed: 25 },
  { month: "Abril", leads: 273, closed: 40 },
  { month: "Mayo", leads: 209, closed: 22 },
  { month: "Junio", leads: 214, closed: 31 },
];

const chartConfig = {
  leads: {
    label: "Leads Generados",
    color: "hsl(var(--chart-1))",
  },
  closed: {
    label: "Ventas Cerradas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const pendingActionsData = {
  es: [
    { id: 'brief-marketing', title: 'Brief de Marketing Profesional', description: 'Completa este formulario para que podamos crear tu estrategia.', href: '/questionnaire/brief-marketing'},
    { id: 'eval-negocio', title: 'Evaluación de Negocio (Doctor RX)', description: 'Ayúdanos a entender tu negocio para un diagnóstico preciso.', href: '/questionnaire/eval-001'},
    { id: 'agent-training', title: 'Entrenamiento de Agente de IA', description: 'Proporciona la información para configurar tu asistente virtual.', href: '/questionnaire/agent-training'},
    { id: 'satisfaction-survey', title: 'Encuesta de Satisfacción', description: 'Tu opinión nos ayuda a mejorar nuestros servicios.', href: '/questionnaire/satisfaction-survey'},
  ],
  en: [
    { id: 'brief-marketing', title: 'Professional Marketing Brief', description: 'Complete this form so we can create your strategy.', href: '/questionnaire/brief-marketing'},
    { id: 'eval-negocio', title: 'Business Evaluation (Doctor RX)', description: 'Help us understand your business for an accurate diagnosis.', href: '/questionnaire/eval-001'},
    { id: 'agent-training', title: 'AI Agent Training', description: 'Provide the information to configure your virtual assistant.', href: '/questionnaire/agent-training'},
    { id: 'satisfaction-survey', title: 'Satisfaction Survey', description: 'Your feedback helps us improve our services.', href: '/questionnaire/satisfaction-survey'},
  ],
  fr: [
    { id: 'brief-marketing', title: 'Brief de Marketing Professionnel', description: 'Remplissez ce formulaire pour que nous puissions créer votre stratégie.', href: '/questionnaire/brief-marketing'},
    { id: 'eval-negocio', title: 'Évaluation d\'Entreprise (Docteur RX)', description: 'Aidez-nous à comprendre votre entreprise pour un diagnostic précis.', href: '/questionnaire/eval-001'},
    { id: 'agent-training', title: 'Formation d\'Agent IA', description: 'Fournissez les informations pour configurer votre assistant virtuel.', href: '/questionnaire/agent-training'},
    { id: 'satisfaction-survey', title: 'Enquête de Satisfaction', description: 'Vos commentaires nous aident à améliorer nos services.', href: '/questionnaire/satisfaction-survey'},
  ]
}

const visibleAnalysesData = {
  es: [ { id: 'analysis-eval-001', title: 'Análisis de Evaluación de Negocio', analysis: { swot: { strengths: "Producto estrella (cold brew) con alta demanda potencial.", weaknesses: "Poca presencia de marca y falta de un canal de ventas digital claro.", opportunities: "Mercado local en crecimiento para cafés de especialidad.", threats: "Competencia de cafeterías establecidas en la zona centro." }, recommendations: "1. **Lanzar Campaña de Branding Local**: Enfocarse en Instagram para dar a conocer el 'cold brew'.\n2. **Implementar Funnel de Ventas**: Crear una landing page para capturar leads interesados en pedidos grandes.\n\n**Plan Sugerido**: Contratar 'Setup Funnel' y 'Marketing de Contenido'." } } ],
  en: [ { id: 'analysis-eval-001', title: 'Business Evaluation Analysis', analysis: { swot: { strengths: "Star product (cold brew) with high potential demand.", weaknesses: "Low brand presence and lack of a clear digital sales channel.", opportunities: "Growing local market for specialty coffees.", threats: "Competition from established coffee shops downtown." }, recommendations: "1. **Launch Local Branding Campaign**: Focus on Instagram to promote the 'cold brew'.\n2. **Implement Sales Funnel**: Create a landing page to capture leads interested in large orders.\n\n**Suggested Plan**: Hire 'Setup Funnel' and 'Content Marketing'." } } ],
  fr: [ { id: 'analysis-eval-001', title: 'Analyse de l\'Évaluation d\'Entreprise', analysis: { swot: { strengths: "Produit phare (cold brew) avec une forte demande potentielle.", weaknesses: "Faible présence de marque et absence de canal de vente numérique clair.", opportunities: "Marché local en croissance pour les cafés de spécialité.", threats: "Concurrence des cafés établis au centre-ville." }, recommendations: "1. **Lancer une campagne de branding locale**: Se concentrer sur Instagram pour faire connaître le 'cold brew'.\n2. **Mettre en place un entonnoir de vente**: Créer une page de destination pour capturer les prospects intéressés par les grosses commandes.\n\n**Plan suggéré**: Engager 'Setup Funnel' et 'Marketing de Contenu'." } } ],
};

const labels = {
  es: { pageTitle: 'Panel de Cliente', welcome: 'Bienvenido', generatedLeads: 'Leads Generados', inLast6Months: 'En los últimos 6 meses', conversionRate: 'Tasa de Conversión', fromLeadToSale: 'De lead a venta', newFollowers: 'Nuevos Seguidores', inAllWindows: 'En todas las redes', funnelPerformance: 'Rendimiento del Embudo de Ventas', funnelDescription: 'Leads generados vs. Ventas cerradas en los últimos 6 meses.', analysisAndResults: 'Análisis y Resultados', analysisDescription: 'Revisa los análisis y recomendaciones estratégicas que hemos preparado para ti.', viewAnalysis: 'Ver Análisis', swotAnalysis: 'Análisis FODA', strengths: 'Fortalezas', opportunities: 'Oportunidades', weaknesses: 'Debilidades', threats: 'Amenazas', strategicRecommendations: 'Recomendaciones Estratégicas', noAnalysisAvailable: 'Aún no hay análisis disponibles.', pendingActions: 'Acciones Pendientes', pendingActionsDescription: 'Completa estos formularios para avanzar con tu estrategia.', complete: 'Completar', analysisDialogDescription: 'Un resumen del análisis FODA y las recomendaciones estratégicas para tu negocio.' },
  en: { pageTitle: 'Customer Dashboard', welcome: 'Welcome', generatedLeads: 'Generated Leads', inLast6Months: 'In the last 6 months', conversionRate: 'Conversion Rate', fromLeadToSale: 'From lead to sale', newFollowers: 'New Followers', inAllWindows: 'On all networks', funnelPerformance: 'Sales Funnel Performance', funnelDescription: 'Leads generated vs. Sales closed in the last 6 months.', analysisAndResults: 'Analysis and Results', analysisDescription: 'Review the strategic analysis and recommendations we have prepared for you.', viewAnalysis: 'View Analysis', swotAnalysis: 'SWOT Analysis', strengths: 'Strengths', opportunities: 'Opportunities', weaknesses: 'Weaknesses', threats: 'Threats', strategicRecommendations: 'Strategic Recommendations', noAnalysisAvailable: 'No analysis available yet.', pendingActions: 'Pending Actions', pendingActionsDescription: 'Complete these forms to move forward with your strategy.', complete: 'Complete', analysisDialogDescription: 'A summary of the SWOT analysis and strategic recommendations for your business.' },
  fr: { pageTitle: 'Tableau de Bord Client', welcome: 'Bienvenue', generatedLeads: 'Prospects Générés', inLast6Months: 'Au cours des 6 derniers mois', conversionRate: 'Taux de Conversion', fromLeadToSale: 'Du prospect à la vente', newFollowers: 'Nouveaux Abonnés', inAllWindows: 'Sur tous les réseaux', funnelPerformance: 'Performance de l\'Entonnoir de Vente', funnelDescription: 'Prospects générés vs Ventes conclues au cours des 6 derniers mois.', analysisAndResults: 'Analyse et Résultats', analysisDescription: 'Examinez l\'analyse stratégique et les recommandations que nous avons préparées pour vous.', viewAnalysis: 'Voir l\'Analyse', swotAnalysis: 'Analyse SWOT', strengths: 'Forces', opportunities: 'Opportunités', weaknesses: 'Faiblesses', threats: 'Menaces', strategicRecommendations: 'Recommandations Stratégiques', noAnalysisAvailable: 'Aucune analyse disponible pour le moment.', pendingActions: 'Actions en Attente', pendingActionsDescription: 'Remplissez ces formulaires pour avancer avec votre stratégie.', complete: 'Compléter', analysisDialogDescription: 'Un résumé de l\'analyse SWOT et des recommandations stratégiques pour votre entreprise.' }
};

export default function DashboardPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const pendingActions = pendingActionsData[language.code as keyof typeof pendingActionsData] || pendingActionsData.en;
  const visibleAnalyses = visibleAnalysesData[language.code as keyof typeof visibleAnalysesData] || visibleAnalysesData.en;


  useEffect(() => {
    if (auth.user?.role !== 'customer') {
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

  if (auth.user?.role !== 'customer') {
    return null; // The layout will handle the redirect message
  }

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
             <Card>
                <CardHeader>
                    <CardTitle>{t.funnelPerformance}</CardTitle>
                    <CardDescription>{t.funnelDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <RechartsBarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="leads" fill="var(--color-leads)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="closed" fill="var(--color-closed)" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t.analysisAndResults}</CardTitle>
                    <CardDescription>{t.analysisDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {visibleAnalyses.length > 0 ? (
                        visibleAnalyses.map(item => (
                            <Dialog key={item.id}>
                                <DialogTrigger asChild>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Eye className="mr-2 h-4 w-4" />
                                            {t.viewAnalysis}
                                        </Button>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>{item.title}</DialogTitle>
                                        <DialogDescription>{t.analysisDialogDescription}</DialogDescription>
                                    </DialogHeader>
                                    <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground mt-4">
                                        <h4>{t.swotAnalysis}</h4>
                                        <div className="grid grid-cols-2 gap-x-4">
                                            <p><strong>{t.strengths}:</strong> {item.analysis.swot.strengths}</p>
                                            <p><strong>{t.opportunities}:</strong> {item.analysis.swot.opportunities}</p>
                                            <p><strong>{t.weaknesses}:</strong> {item.analysis.swot.weaknesses}</p>
                                            <p><strong>{t.threats}:</strong> {item.analysis.swot.threats}</p>
                                        </div>
                                        <h4 className="mt-4">{t.strategicRecommendations}</h4>
                                        <div 
                                            className="whitespace-pre-wrap font-sans text-sm" 
                                            dangerouslySetInnerHTML={{ __html: item.analysis.recommendations.replace(/\* /g, '• ').replace(/\n/g, '<br />') }}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))
                    ) : (
                        <p className="text-sm text-center text-muted-foreground py-4">{t.noAnalysisAvailable}</p>
                    )}
                </CardContent>
            </Card>

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
          </div>
        </div>
    </div>
  );
}

    