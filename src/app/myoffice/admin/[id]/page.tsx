
'use client';

import { useState, useMemo, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Edit, ArrowLeft, CheckCircle, Clock, BarChart, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts";
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';
import type { Customer } from '@/lib/types';
import { es } from 'date-fns/locale';
import { initialCustomers } from '@/lib/constants';

const chartData = [
  { month: "Enero", leads: 186, closed: 20 },
  { month: "Febrero", leads: 305, closed: 35 },
  { month: "Marzo", leads: 237, closed: 25 },
  { month: "Abril", leads: 273, closed: 40 },
  { month: "Mayo", leads: 209, closed: 22 },
  { month: "Junio", leads: 214, closed: 31 },
];

const chartConfig = {
  leads: { label: "Leads", color: "hsl(var(--chart-1))" },
  closed: { label: "Cierres", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const activeServices = [
  { id: 's-content-15', name: 'Marketing de Contenido (15 + 15 / mes)', type: 'sub', status: 'Activo' },
  { id: 'p-funnel-setup', name: 'Setup Funnel (Landing + Formularios + Agente IA)', type: 'one', status: 'Completado' },
];

const customerQuestionnaires = [
  { id: 'brief-001', type: 'Evaluación de Negocio', status: 'Completado', date: new Date('2024-05-10')},
  { id: 'brief-marketing-002', type: 'Brief de Marketing Profesional', status: 'Pendiente', date: new Date('2024-05-15')},
  { id: 'agent-training-001', type: 'Entrenamiento de Agente IA', status: 'Pendiente', date: new Date('2024-05-16')},
];


export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { currency } = useCurrency();
  const customerId = use(Promise.resolve(params.id));
  const [customerData, setCustomerData] = useState<Customer | undefined>(undefined);
  
  useEffect(() => {
    const customer = initialCustomers.find(c => c.id === customerId);
    if (customer) {
      setCustomerData(customer);
    } else {
        router.push('/myoffice/admin');
    }
  }, [customerId, router]);

  const totalLeads = useMemo(() => chartData.reduce((acc, item) => acc + item.leads, 0), []);
  const totalClosed = useMemo(() => chartData.reduce((acc, item) => acc + item.closed, 0), []);
  const conversionRate = totalLeads > 0 ? (totalClosed / totalLeads) * 100 : 0;
  
  if (!customerData) {
      return (
        <div className="flex h-full w-full items-center justify-center">
            <p>Cargando cliente...</p>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <header>
          <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/myoffice/admin"><ArrowLeft className="mr-2"/> Volver a Clientes</Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline">Detalle del Cliente</h1>
          <p className="text-muted-foreground">Vista 360° de {customerData.name} ({customerData.email})</p>
      </header>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Plan:</strong> {customerData.plan}</p>
                    <p><strong>Ingresos Totales:</strong> {formatCurrency(customerData.revenue, currency)}</p>
                    <p><strong>Miembro Desde:</strong> {format(customerData.signupDate, "dd MMM, yyyy", { locale: es })}</p>
                    <p><strong>Estado:</strong> <Badge variant={customerData.status === 'Active' ? 'default' : 'destructive'} className={customerData.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>{customerData.status}</Badge></p>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShoppingBag /> Servicios Activos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Servicio</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeServices.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell><Badge variant={service.type === 'sub' ? 'default' : 'secondary'}>{service.type === 'sub' ? 'Suscripción' : 'Pago Único'}</Badge></TableCell>
                                <TableCell><Badge variant="outline">{service.status}</Badge></TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Cuestionarios Asignados</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {customerQuestionnaires.map((q) => (
                        <TableRow key={q.id}>
                        <TableCell className="font-medium">{q.type}</TableCell>
                        <TableCell>
                            <Badge variant={q.status === 'Completado' ? 'default' : 'secondary'} className={q.status === 'Completado' ? 'bg-accent text-accent-foreground' : ''}>
                            {q.status === 'Completado' ? <CheckCircle className="mr-1 h-4 w-4" /> : <Clock className="mr-1 h-4 w-4" />}
                            {q.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                            <Link href={`/myoffice/questionnaires/${q.id}`}>
                                {q.status === 'Completado' ? 'Ver Respuestas' : 'Ver Envío'}
                            </Link>
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart/> KPIs de Marketing</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold">{totalLeads}</p>
                    <p className="text-sm text-muted-foreground">Leads</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold">{totalClosed}</p>
                    <p className="text-sm text-muted-foreground">Cierres</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Conversión</p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Analíticas de Rendimiento</CardTitle>
                <CardDescription>Leads vs Cierres en los últimos 6 meses.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <RechartsBarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="leads" fill="var(--color-leads)" radius={4} />
                    <Bar dataKey="closed" fill="var(--color-closed)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>

    </div>
  );
}
