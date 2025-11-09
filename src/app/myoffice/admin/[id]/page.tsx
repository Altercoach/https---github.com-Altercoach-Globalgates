
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Edit, ArrowLeft, CheckCircle, Clock, BarChart, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts";
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';
import type { Customer } from '@/lib/types';
import { es, enUS, fr } from 'date-fns/locale';
import { initialCustomers } from '@/lib/constants';
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

const labels = {
  es: {
    backToClients: "Volver a Clientes",
    pageTitle: "Detalle del Cliente",
    pageSubtitle: "Vista 360° de",
    loading: "Cargando cliente...",
    generalInfo: "Información General",
    plan: "Plan",
    totalRevenue: "Ingresos Totales",
    memberSince: "Miembro Desde",
    status: "Estado",
    activeServices: "Servicios Activos",
    service: "Servicio",
    type: "Type",
    subType: "Suscripción",
    oneTimeType: "Pago Único",
    assignedQuestionnaires: "Cuestionarios Asignados",
    actions: "Acciones",
    completedStatus: "Completado",
    pendingStatus: "Pendiente",
    viewResponses: "Ver Respuestas",
    viewSubmission: "Ver Envío",
    marketingKPIs: "KPIs de Marketing",
    leads: "Leads",
    closures: "Cierres",
    conversion: "Conversión",
    performanceAnalytics: "Analíticas de Rendimiento",
    performanceDesc: "Leads vs Cierres en los últimos 6 meses.",
  },
  en: {
    backToClients: "Back to Clients",
    pageTitle: "Customer Detail",
    pageSubtitle: "360° view of",
    loading: "Loading customer...",
    generalInfo: "General Information",
    plan: "Plan",
    totalRevenue: "Total Revenue",
    memberSince: "Member Since",
    status: "Status",
    activeServices: "Active Services",
    service: "Service",
    type: "Type",
    subType: "Subscription",
    oneTimeType: "One-time Payment",
    assignedQuestionnaires: "Assigned Questionnaires",
    actions: "Actions",
    completedStatus: "Completed",
    pendingStatus: "Pending",
    viewResponses: "View Responses",
    viewSubmission: "View Submission",
    marketingKPIs: "Marketing KPIs",
    leads: "Leads",
    closures: "Closures",
    conversion: "Conversion",
    performanceAnalytics: "Performance Analytics",
    performanceDesc: "Leads vs. Closures in the last 6 months.",
  },
  fr: {
    backToClients: "Retour aux Clients",
    pageTitle: "Détail du Client",
    pageSubtitle: "Vue à 360° de",
    loading: "Chargement du client...",
    generalInfo: "Informations Générales",
    plan: "Plan",
    totalRevenue: "Revenu Total",
    memberSince: "Membre Depuis",
    status: "Statut",
    activeServices: "Services Actifs",
    service: "Service",
    type: "Type",
    subType: "Abonnement",
    oneTimeType: "Paiement Unique",
    assignedQuestionnaires: "Questionnaires Assignés",
    actions: "Actions",
    completedStatus: "Complété",
    pendingStatus: "En attente",
    viewResponses: "Voir les Réponses",
    viewSubmission: "Voir la Soumission",
    marketingKPIs: "KPIs Marketing",
    leads: "Prospects",
    closures: "Fermetures",
    conversion: "Conversion",
    performanceAnalytics: "Analytique de Performance",
    performanceDesc: "Prospects vs Fermetures des 6 derniers mois.",
  }
};


export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { currency } = useCurrency();
  const customerId = params.id as string;
  const [customerData, setCustomerData] = useState<Customer | undefined>(undefined);
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  const locale = { es, en: enUS, fr }[language.code] || enUS;
  
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
            <p>{t.loading}</p>
        </div>
      );
  }

  const getStatusBadgeVariant = (status: Customer['status']): 'default' | 'secondary' | 'destructive' => {
      switch (status) {
          case 'Active':
              return 'default';
          case 'Suspended':
              return 'secondary';
          case 'Canceled':
              return 'destructive';
      }
  }

  return (
    <div className="space-y-6">
      <header>
          <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/myoffice/admin"><ArrowLeft className="mr-2"/> {t.backToClients}</Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageSubtitle} {customerData.name} ({customerData.email})</p>
      </header>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader><CardTitle>{t.generalInfo}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>{t.plan}:</strong> {customerData.plan}</p>
                    <p><strong>{t.totalRevenue}:</strong> {formatCurrency(customerData.revenue, currency)}</p>
                    <p><strong>{t.memberSince}:</strong> {format(customerData.signupDate, "dd MMM, yyyy", { locale })}</p>
                    <div className="flex items-center gap-2">
                      <strong>{t.status}:</strong> 
                      <Badge variant={getStatusBadgeVariant(customerData.status)} className={customerData.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
                        {customerData.status}
                      </Badge>
                    </div>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShoppingBag /> {t.activeServices}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.service}</TableHead>
                                <TableHead>{t.type}</TableHead>
                                <TableHead>{t.status}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeServices.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell><Badge variant={service.type === 'sub' ? 'default' : 'secondary'}>{service.type === 'sub' ? t.subType : t.oneTimeType}</Badge></TableCell>
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
                <CardTitle className="flex items-center gap-2"><FileText /> {t.assignedQuestionnaires}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t.type}</TableHead>
                        <TableHead>{t.status}</TableHead>
                        <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {customerQuestionnaires.map((q) => {
                       const isCompleted = q.status === 'Completado';
                       return (
                        <TableRow key={q.id}>
                        <TableCell className="font-medium">{q.type}</TableCell>
                        <TableCell>
                            <Badge variant={isCompleted ? 'default' : 'secondary'} className={isCompleted ? 'bg-accent text-accent-foreground' : ''}>
                            {isCompleted ? <CheckCircle className="mr-1 h-4 w-4" /> : <Clock className="mr-1 h-4 w-4" />}
                            {isCompleted ? t.completedStatus : t.pendingStatus}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                            <Link href={`/myoffice/questionnaires/${q.id}`}>
                                {isCompleted ? t.viewResponses : t.viewSubmission}
                            </Link>
                            </Button>
                        </TableCell>
                        </TableRow>
                       )
                    })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart/> {t.marketingKPIs}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold">{totalLeads}</p>
                    <p className="text-sm text-muted-foreground">{t.leads}</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold">{totalClosed}</p>
                    <p className="text-sm text-muted-foreground">{t.closures}</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">{t.conversion}</p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>{t.performanceAnalytics}</CardTitle>
                <CardDescription>{t.performanceDesc}</CardDescription>
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

    