
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, BarChart, FileText, ShoppingBag, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts";
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';

const chartData = [
  { month: "Enero", leads: 186 },
  { month: "Febrero", leads: 305 },
  { month: "Marzo", leads: 237 },
  { month: "Abril", leads: 273 },
  { month: "Mayo", leads: 209 },
  { month: "Junio", leads: 214 },
];

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


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

  if (auth.user?.role !== 'customer') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
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
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Acciones Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                        <div>
                            <h4 className="font-semibold">Evaluación de Negocio</h4>
                            <p className="text-sm text-muted-foreground">Completa este formulario para que podamos crear tu estrategia.</p>
                        </div>
                        <Button asChild>
                            <Link href="/questionnaire/eval-cliente-demo">
                                <Edit className="mr-2" />
                                Completar Ahora
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingBag /> Servicios Activos</CardTitle>
              </CardHeader>
              <CardContent>
                {activeServices.length > 0 ? (
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
                          <TableCell><Badge variant="outline" className="text-accent-foreground bg-accent/20 border-accent/50">{service.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No tienes servicios activos. Visita nuestra sección de planes para empezar.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart /> Analíticas de Leads</CardTitle>
                 <CardDescription>Rendimiento de los últimos 6 meses.</CardDescription>
              </header>
              <CardContent>
                 <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <RechartsBarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar dataKey="leads" fill="var(--color-leads)" radius={4} />
                    </RechartsBarChart>
                  </ChartContainer>
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
                    <p className="text-muted-foreground">No hay historial de facturación.</p>
                  )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

    