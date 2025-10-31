'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, BarChart, FileText, ShoppingBag, Edit, CheckCircle, Target, Percent, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';

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

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const { hasPurchased } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    if (auth.user?.role !== 'customer') {
      router.push('/login');
    }
  }, [auth, router]);

  const activeServices = useMemo(() => {
    if (!hasPurchased) return [];
    // Simulating purchased items for demonstration
    const purchasedItems = [
      { id: 's-content-15', name: 'Marketing de Contenido (15 + 15 / mes)', type: 'sub', status: 'Activo' },
      { id: 'p-funnel-setup', name: 'Setup Funnel (Landing + Formularios + Chat)', type: 'one', status: 'Completado' },
    ];
    return purchasedItems;
  }, [hasPurchased]);

  const billingHistory = useMemo(() => {
    if(!hasPurchased) return [];
    return [
      { id: 'INV001', date: new Date(), item: 'Setup Funnel + Content Marketing', amount: 650, status: 'Pagado'},
      { id: 'INV002', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), item: 'Content Marketing', amount: 350, status: 'Pagado'},
    ]
  }, [hasPurchased, currency]);
  
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Panel de Cliente</h1>
            <p className="text-muted-foreground">Bienvenido, {auth.user?.email}</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2" />
            Cerrar Sesión
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
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
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
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
                    <CardTitle>Acciones Pendientes</CardTitle>
                    <CardDescription>Completa estos formularios para avanzar con tu estrategia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingActions.map(action => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                          <div>
                              <h4 className="font-semibold">{action.title}</h4>
                          </div>
                          <Button asChild size="sm">
                              <Link href={action.href}>
                                  <Edit className="mr-2" />
                                  Completar
                              </Link>
                          </Button>
                      </div>
                    ))}
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText /> Historial de Facturación</CardTitle>
                </CardHeader>
                <CardContent>
                   {billingHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingHistory.map(invoice => (
                          <TableRow key={invoice.id}>
                            <TableCell>
                              <div className="font-medium">{format(invoice.date, "dd MMM, yyyy")}</div>
                              <div className="text-xs text-muted-foreground">{invoice.item}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(invoice.amount, currency)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground p-4 text-center">No hay historial de facturación.</p>
                  )}
                </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingBag /> Servicios Contratados</CardTitle>
              </CardHeader>
              <CardContent>
                {activeServices.length > 0 ? (
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeServices.map(service => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-accent-foreground bg-accent/20 border-accent/50">{service.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground p-4 text-center">No tienes servicios activos.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
