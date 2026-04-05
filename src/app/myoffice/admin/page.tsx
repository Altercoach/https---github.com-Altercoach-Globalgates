'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Users, ShoppingCart, MoreHorizontal, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import type { Customer } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { RouteGuard } from '@/components/auth/route-guard';

const labels = {
  es: {
    pageTitle: 'Administracion del Negocio',
    pageSubtitle: 'Gestiona tus clientes, planes y visualiza tus ventas.',
    totalRevenue: 'Ingresos Totales',
    totalRevenueDesc: 'Ingresos totales generados',
    activeClients: 'Clientes Activos',
    activeClientsDesc: 'Clientes con servicios activos',
    activeSubscriptions: 'Suscripciones Activas',
    activeSubscriptionsDesc: 'Planes de suscripcion mensuales',
    clients: 'Clientes',
    searchPlaceholder: 'Buscar por nombre o email...',
    filterByStatus: 'Filtrar por estado',
    allStatuses: 'Todos los estados',
    active: 'Activo',
    suspended: 'Suspendido',
    canceled: 'Cancelado',
    actions: 'Acciones',
    bulkActions: 'Acciones en Lote',
    suspend: 'Suspender',
    reactivate: 'Reactivar',
    deleteAction: 'Eliminar',
    noClientSelected: 'Ningun cliente seleccionado',
    noClientSelectedDesc: 'Por favor, selecciona al menos un cliente.',
    actionCompleted: 'Accion completada',
    clientsSuspended: 'clientes suspendidos',
    clientsReactivated: 'clientes reactivados',
    clientsDeleted: 'clientes eliminados',
    selectAll: 'Seleccionar todo',
    client: 'Cliente',
    plan: 'Plan',
    status: 'Estado',
    memberSince: 'Miembro Desde',
    viewDetails: 'Ver detalles',
    sendMessage: 'Enviar mensaje',
    noResults: 'No se encontraron resultados.',
  },
  en: {
    pageTitle: 'Business Administration',
    pageSubtitle: 'Manage your clients, plans, and view your sales.',
    totalRevenue: 'Total Revenue',
    totalRevenueDesc: 'Total generated revenue',
    activeClients: 'Active Clients',
    activeClientsDesc: 'Clients with active services',
    activeSubscriptions: 'Active Subscriptions',
    activeSubscriptionsDesc: 'Monthly subscription plans',
    clients: 'Clients',
    searchPlaceholder: 'Search by name or email...',
    filterByStatus: 'Filter by status',
    allStatuses: 'All statuses',
    active: 'Active',
    suspended: 'Suspended',
    canceled: 'Canceled',
    actions: 'Actions',
    bulkActions: 'Bulk Actions',
    suspend: 'Suspend',
    reactivate: 'Reactivate',
    deleteAction: 'Delete',
    noClientSelected: 'No client selected',
    noClientSelectedDesc: 'Please select at least one client.',
    actionCompleted: 'Action completed',
    clientsSuspended: 'clients suspended',
    clientsReactivated: 'clients reactivated',
    clientsDeleted: 'clients deleted',
    selectAll: 'Select all',
    client: 'Client',
    plan: 'Plan',
    status: 'Status',
    memberSince: 'Member Since',
    viewDetails: 'View details',
    sendMessage: 'Send message',
    noResults: 'No results found.',
  },
  fr: {
    pageTitle: "Administration de l'Entreprise",
    pageSubtitle: 'Gerez vos clients, vos plans et visualisez vos ventes.',
    totalRevenue: 'Revenu Total',
    totalRevenueDesc: 'Revenu total genere',
    activeClients: 'Clients Actifs',
    activeClientsDesc: 'Clients avec des services actifs',
    activeSubscriptions: 'Abonnements Actifs',
    activeSubscriptionsDesc: "Plans d'abonnement mensuels",
    clients: 'Clients',
    searchPlaceholder: 'Rechercher par nom ou e-mail...',
    filterByStatus: 'Filtrer par statut',
    allStatuses: 'Tous les statuts',
    active: 'Actif',
    suspended: 'Suspendu',
    canceled: 'Annule',
    actions: 'Actions',
    bulkActions: 'Actions en Masse',
    suspend: 'Suspendre',
    reactivate: 'Reactiver',
    deleteAction: 'Supprimer',
    noClientSelected: 'Aucun client selectionne',
    noClientSelectedDesc: 'Veuillez selectionner au moins un client.',
    actionCompleted: 'Action terminee',
    clientsSuspended: 'clients suspendus',
    clientsReactivated: 'clients reactives',
    clientsDeleted: 'clients supprimes',
    selectAll: 'Tout selectionner',
    client: 'Client',
    plan: 'Plan',
    status: 'Statut',
    memberSince: 'Membre Depuis',
    viewDetails: 'Voir les details',
    sendMessage: 'Envoyer un message',
    noResults: 'Aucun resultat trouve.',
  },
};

const initialCustomers: Customer[] = [
  { id: '1', name: 'Ana Garcia', email: 'ana@example.com', plan: 'Pro', status: 'Active', revenue: 1200, signupDate: new Date('2024-01-15') },
  { id: '2', name: 'Carlos Lopez', email: 'carlos@example.com', plan: 'Basic', status: 'Active', revenue: 400, signupDate: new Date('2024-03-20') },
  { id: '3', name: 'Maria Torres', email: 'maria@example.com', plan: 'Enterprise', status: 'Suspended', revenue: 3600, signupDate: new Date('2023-11-10') },
];

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] ?? labels.en;

  useEffect(() => { setIsMounted(true); }, []);

  const filteredCustomers = useMemo(() =>
    customers.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    }),
  [customers, searchTerm, statusFilter]);

  const kpi = useMemo(() => ({
    totalRevenue: customers.reduce((sum, c) => sum + c.revenue, 0),
    activeClients: customers.filter(c => c.status === 'Active').length,
    activeSubscriptions: customers.filter(c => c.status === 'Active').length,
  }), [customers]);

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredCustomers.map(c => c.id) : []);
  };

  const handleBulkAction = (action: 'suspend' | 'activate' | 'delete') => {
    if (selectedIds.length === 0) {
      toast({ title: t.noClientSelected, description: t.noClientSelectedDesc, variant: 'destructive' });
      return;
    }
    if (action === 'delete') {
      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)));
      toast({ title: t.actionCompleted, description: `${selectedIds.length} ${t.clientsDeleted}` });
    } else {
      const newStatus = action === 'suspend' ? 'Suspended' : 'Active';
      setCustomers(prev => prev.map(c =>
        selectedIds.includes(c.id) ? { ...c, status: newStatus as Customer['status'] } : c
      ));
      const msg = action === 'suspend' ? t.clientsSuspended : t.clientsReactivated;
      toast({ title: t.actionCompleted, description: `${selectedIds.length} ${msg}` });
    }
    setSelectedIds([]);
  };

  const getStatusVariant = (status: Customer['status']): 'default' | 'secondary' | 'destructive' => {
    if (status === 'Active') return 'default';
    if (status === 'Suspended') return 'secondary';
    return 'destructive';
  };

  if (!isMounted) return null;

  return (
    <RouteGuard requireAuth requireRole="admin">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(kpi.totalRevenue, currency)}</div>
              <p className="text-xs text-muted-foreground">{t.totalRevenueDesc}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.activeClients}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.activeClients}</div>
              <p className="text-xs text-muted-foreground">{t.activeClientsDesc}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.activeSubscriptions}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">{t.activeSubscriptionsDesc}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.clients}</CardTitle>
            <div className="flex gap-2 flex-wrap mt-2">
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('suspend')} disabled={selectedIds.length === 0}>
                {t.suspend}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')} disabled={selectedIds.length === 0}>
                {t.reactivate}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')} disabled={selectedIds.length === 0}>
                {t.deleteAction}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onCheckedChange={v => handleSelectAll(!!v)}
                    />
                  </TableHead>
                  <TableHead>{t.client}</TableHead>
                  <TableHead>{t.plan}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.memberSince}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(c.id)}
                          onCheckedChange={v => handleSelect(c.id, !!v)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </TableCell>
                      <TableCell>{c.plan}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
                      </TableCell>
                      <TableCell>{c.signupDate.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/myoffice/admin/${c.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                {t.viewDetails}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${c.email}`} className="flex items-center">
                                {t.sendMessage}
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {t.noResults}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
