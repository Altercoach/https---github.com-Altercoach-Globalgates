
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';

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

const pendingActions = [
    {
        id: 'brief-marketing',
        title: 'Brief de Marketing Profesional',
        description: 'Completa este formulario para que podamos crear tu estrategia.',
        href: '/questionnaire/brief-marketing',
    },
    {
        id: 'eval-negocio',
        title: 'Evaluación de Negocio (Doctor RX)',
        description: 'Ayúdanos a entender tu negocio para un diagnóstico preciso.',
        href: '/questionnaire/eval-001',
    },
    {
        id: 'agent-training',
        title: 'Entrenamiento de Agente de IA',
        description: 'Proporciona la información para configurar tu asistente virtual.',
        href: '/questionnaire/agent-training',
    },
     {
        id: 'satisfaction-survey',
        title: 'Encuesta de Satisfacción',
        description: 'Tu opinión nos ayuda a mejorar nuestros servicios.',
        href: '/questionnaire/satisfaction-survey',
    },
];

// Mock data, this would come from a backend checking admin settings
const visibleAnalyses: { id: string, title: string, analysis: AnalyzeBusinessEvaluationOutput }[] = [
    {
        id: 'analysis-eval-001',
        title: 'Análisis de Evaluación de Negocio',
        analysis: {
            swot: {
                strengths: "Producto estrella (cold brew) con alta demanda potencial.",
                weaknesses: "Poca presencia de marca y falta de un canal de ventas digital claro.",
                opportunities: "Mercado local en crecimiento para cafés de especialidad.",
                threats: "Competencia de cafeterías establecidas en la zona centro."
            },
            recommendations: "1. **Lanzar Campaña de Branding Local**: Enfocarse en Instagram para dar a conocer el 'cold brew'.\n2. **Implementar Funnel de Ventas**: Crear una landing page para capturar leads interesados en pedidos grandes.\n\n**Plan Sugerido**: Contratar 'Setup Funnel' y 'Marketing de Contenido'."
        }
    }
];

export default function DashboardPage() {
  const { auth } = useAuth();
  const router = useRouter();

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
          <h1 className="text-3xl font-bold font-headline">Panel de Cliente</h1>
          <p className="text-muted-foreground">Bienvenido, {auth.user?.email}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leads Generados</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.totalLeads}</div>
                    <p className="text-xs text-muted-foreground">En los últimos 6 meses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.conversionRate}</div>
                    <p className="text-xs text-muted-foreground">De lead a venta</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nuevos Seguidores</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpis.newFollowers}</div>
                    <p className="text-xs text-muted-foreground">En todas las redes</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-1">
          <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Rendimiento del Embudo de Ventas</CardTitle>
                    <CardDescription>Leads generados vs. Ventas cerradas en los últimos 6 meses.</CardDescription>
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
                    <CardTitle>Análisis y Resultados</CardTitle>
                    <CardDescription>Revisa los análisis y recomendaciones estratégicas que hemos preparado para ti.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {visibleAnalyses.length > 0 ? (
                        visibleAnalyses.map(item => (
                            <Dialog key={item.id}>
                                <DialogTrigger asChild>
                                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg cursor-pointer hover:bg-accent/20 transition-colors">
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver Análisis
                                        </Button>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>{item.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground mt-4">
                                        <h4>Análisis FODA</h4>
                                        <div className="grid grid-cols-2 gap-x-4">
                                            <p><strong>Fortalezas:</strong> {item.analysis.swot.strengths}</p>
                                            <p><strong>Oportunidades:</strong> {item.analysis.swot.opportunities}</p>
                                            <p><strong>Debilidades:</strong> {item.analysis.swot.weaknesses}</p>
                                            <p><strong>Amenazas:</strong> {item.analysis.swot.threats}</p>
                                        </div>
                                        <h4 className="mt-4">Recomendaciones Estratégicas</h4>
                                        <div 
                                            className="whitespace-pre-wrap font-sans text-sm" 
                                            dangerouslySetInnerHTML={{ __html: item.analysis.recommendations.replace(/\* /g, '• ').replace(/\n/g, '<br />') }}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))
                    ) : (
                        <p className="text-sm text-center text-muted-foreground py-4">Aún no hay análisis disponibles.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Acciones Pendientes</CardTitle>
                    <CardDescription>Completa estos formularios para avanzar con tu estrategia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingActions.map(action => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                          <div>
                              <h4 className="font-semibold">{action.title}</h4>
                          </div>
                          <Button asChild size="sm">
                              <Link href={action.href}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Completar
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
