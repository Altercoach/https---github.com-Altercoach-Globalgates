
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, DollarSign, Users, ShoppingCart, Search, Filter, XCircle, PlayCircle, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS, fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import type { Customer } from '@/lib/types';
import Link from 'next/link';
import { initialCustomers } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    pageTitle: "Administración del Negocio",
    pageSubtitle: "Gestiona tus clientes, planes y visualiza tus ventas.",
    totalRevenue: "Ingresos Totales",
    totalRevenueDesc: "Ingresos totales generados",
    activeClients: "Clientes Activos",
    activeClientsDesc: "Clientes con servicios activos",
    activeSubscriptions: "Suscripciones Activas",
    activeSubscriptionsDesc: "Planes de suscripción mensuales",
    clients: "Clientes",
    searchPlaceholder: "Buscar por nombre o email...",
    filterByStatus: "Filtrar por estado",
    allStatuses: "Todos los estados",
    active: "Activo",
    suspended: "Suspendido",
    canceled: "Cancelado",
    actions: "Acciones",
    bulkActions: "Acciones en Lote",
    suspend: "Suspender",
    reactivate: "Reactivar",
    delete: "Eliminar",
    noClientSelected: "Ningún cliente seleccionado",
    noClientSelectedDesc: "Por favor, selecciona al menos un cliente.",
    actionCompleted: "Acción completada",
    clientsSuspended: "clientes suspendidos",
    clientsReactivated: "clientes reactivados",
    clientsDeleted: "clientes eliminados",
    selectAll: "Seleccionar todo",
    client: "Cliente",
    plan: "Plan",
    status: "Estado",
    memberSince: "Miembro Desde",
    viewDetails: "Ver detalles",
    sendMessage: "Enviar mensaje",
    noResults: "No se encontraron resultados.",
  },
  en: {
    pageTitle: "Business Administration",
    pageSubtitle: "Manage your clients, plans, and view your sales.",
    totalRevenue: "Total Revenue",
    totalRevenueDesc: "Total generated revenue",
    activeClients: "Active Clients",
    activeClientsDesc: "Clients with active services",
    activeSubscriptions: "Active Subscriptions",
    activeSubscriptionsDesc: "Monthly subscription plans",
    clients: "Clients",
    searchPlaceholder: "Search by name or email...",
    filterByStatus: "Filter by status",
    allStatuses: "All statuses",
    active: "Active",
    suspended: "Suspended",
    canceled: "Canceled",
    actions: "Actions",
    bulkActions: "Bulk Actions",
    suspend: "Suspend",
    reactivate: "Reactivate",
    delete: "Delete",
    noClientSelected: "No client selected",
    noClientSelectedDesc: "Please select at least one client.",
    actionCompleted: "Action completed",
    clientsSuspended: "clients suspended",
    clientsReactivated: "clients reactivated",
    clientsDeleted: "clients deleted",
    selectAll: "Select all",
    client: "Client",
    plan: "Plan",
    status: "Status",
    memberSince: "Member Since",
    viewDetails: "View details",
    sendMessage: "Send message",
    noResults: "No results found.",
  },
  fr: {
    pageTitle: "Administration de l'Entreprise",
    pageSubtitle: "Gérez vos clients, vos plans et visualisez vos ventes.",
    totalRevenue: "Revenu Total",
    totalRevenueDesc: "Revenu total généré",
    activeClients: "Clients Actifs",
    activeClientsDesc: "Clients avec des services actifs",
    activeSubscriptions: "Abonnements Actifs",
    activeSubscriptionsDesc: "Plans d'abonnement mensuels",
    clients: "Clients",
    searchPlaceholder: "Rechercher par nom ou e-mail...",
    filterByStatus: "Filtrer par statut",
    allStatuses: "Tous les statuts",
    active: "Actif",
    suspended: "Suspendu",
    canceled: "Annulé",
    actions: "Actions",
    bulkActions: "Actions en Masse",
    suspend: "Suspendre",
    reactivate: "Réactiver",
    delete: "Supprimer",
    noClientSelected: "Aucun client sélectionné",
    noClientSelectedDesc: "Veuillez sélectionner au moins un client.",
    actionCompleted: "Action terminée",
    clientsSuspended: "clients suspendus",
    clientsReactivated: "clients réactivés",
    clientsDeleted: "clients supprimés",
    selectAll: "Tout sélectionner",
    client: "Client",
    plan: "Plan",
    status: "Statut",
    memberSince: "Membre Depuis",
    viewDetails: "Voir les détails",
    sendMessage: "Envoyer un message",
    noResults: "Aucun résultat trouvé.",
  }
};


export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  const locale = { es, en: enUS, fr }[language.code] || enUS;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    setSelectedCustomerIds(prev =>
      checked ? [...prev, customerId] : prev.filter(id => id !== customerId)
    );
  };
  
  const handleSelectAll = (checked: boolean) => {
      setSelectedCustomerIds(checked ? filteredCustomers.map(c => c.id) : []);
  };

  const handleBulkAction = (action: 'suspend' | 'activate' | 'delete') => {
    if(selectedCustomerIds.length === 0) {
      toast({ title: t.noClientSelected, description: t.noClientSelectedDesc, variant: 'destructive'});
      return;
    }

    let message = '';
    let toastMessage = '';
    setCustomers(prev => prev.map(c => {
        if(selectedCustomerIds.includes(c.id)) {
            switch(action) {
                case 'suspend': c.status = 'Suspended'; toastMessage = t.clientsSuspended; break;
                case 'activate': c.status = 'Active'; toastMessage = t.clientsReactivated; break;
                case 'delete': return null;
            }
        }
        return c;
    }).filter(Boolean) as Customer[]);

    if (action === 'delete') {
      toastMessage = t.clientsDeleted;
    }

    toast({ title: t.actionCompleted, description: `Se han ${toastMessage} correctamente.`});
    setSelectedCustomerIds([]);
  }

  const kpi = useMemo(() => ({
    totalRevenue: customers.reduce((sum, c) => sum + c.revenue, 0),
    activeClients: customers.filter(c => c.status === 'Active').length,
    activeSubscriptions: customers.filter(c => c.status === 'Active').length,
  }), [customers]);
  
  if (!isMounted) {
    return null;
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
        <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageSubtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpi.totalRevenue, currency)}</div>
            <p className="text-xs text-muted-foreground">{t.totalRevenueDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeClients}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.activeClients}</div>
             <p className="text-xs text-muted-foreground">{t.activeClientsDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.searchPlaceholder}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder={t.filterByStatus} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t.allStatuses}</SelectItem>
                    <SelectItem value="active">{t.active}</SelectItem>
                    <SelectItem value="suspended">{t.suspended}</SelectItem>
                    <SelectItem value="canceled">{t.canceled}</SelectItem>
                </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={selectedCustomerIds.length === 0}>
                          {t.actions} ({selectedCustomerIds.length})
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuLabel>{t.bulkActions}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleBulkAction('suspend')}><XCircle className="mr-2"/> {t.suspend}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('activate')}><PlayCircle className="mr-2"/> {t.reactivate}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleBulkAction('delete')}><Trash2 className="mr-2"/> {t.delete}</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                   <Checkbox
                    checked={selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    aria-label={t.selectAll}
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
                filteredCustomers.map(customer => (
                  <TableRow key={customer.id} data-state={selectedCustomerIds.includes(customer.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomerIds.includes(customer.id)}
                        onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)}
                        aria-label={`Seleccionar ${customer.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </TableCell>
                    <TableCell>{customer.plan}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(customer.status)}
                        className={customer.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(customer.signupDate, "dd MMM, yyyy", { locale: locale })}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                           <DropdownMenuItem asChild>
                            <Link href={`/myoffice/admin/${customer.id}`} className="flex items-center cursor-pointer">
                              <Eye className="mr-2"/>{t.viewDetails}
                            </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                             <a href={`mailto:${customer.email}`} className="flex items-center cursor-pointer">
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
  );
}
