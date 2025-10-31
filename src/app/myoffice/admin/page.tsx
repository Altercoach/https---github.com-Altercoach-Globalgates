

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
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import type { Customer } from '@/lib/types';
import Link from 'next/link';
import { initialCustomers } from '@/lib/constants';


export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);

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
      toast({ title: 'Ningún cliente seleccionado', description: 'Por favor, selecciona al menos un cliente.', variant: 'destructive'});
      return;
    }

    let message = '';
    setCustomers(prev => prev.map(c => {
        if(selectedCustomerIds.includes(c.id)) {
            switch(action) {
                case 'suspend': c.status = 'Suspended'; message = 'clientes suspendidos'; break;
                case 'activate': c.status = 'Active'; message = 'clientes reactivados'; break;
                case 'delete': return null; // We'll filter this out
            }
        }
        return c;
    }).filter(Boolean) as Customer[]);

    if (action === 'delete') {
      message = 'clientes eliminados';
    }

    toast({ title: 'Acción completada', description: `Se han ${message} correctamente.`});
    setSelectedCustomerIds([]);
  }

  const kpi = useMemo(() => ({
    totalRevenue: customers.reduce((sum, c) => sum + c.revenue, 0),
    activeClients: customers.filter(c => c.status === 'Active').length,
    activeSubscriptions: customers.filter(c => c.status === 'Active').length, // Simplified logic
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
        <h1 className="text-3xl font-bold font-headline">Administración del Negocio</h1>
        <p className="text-muted-foreground">Gestiona tus clientes, planes y visualiza tus ventas.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpi.totalRevenue, currency)}</div>
            <p className="text-xs text-muted-foreground">Ingresos totales generados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.activeClients}</div>
             <p className="text-xs text-muted-foreground">Clientes con servicios activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Planes de suscripción mensuales</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre o email..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={selectedCustomerIds.length === 0}>
                          Acciones ({selectedCustomerIds.length})
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuLabel>Acciones en Lote</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleBulkAction('suspend')}><XCircle className="mr-2"/> Suspender</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('activate')}><PlayCircle className="mr-2"/> Reactivar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleBulkAction('delete')}><Trash2 className="mr-2"/> Eliminar</DropdownMenuItem>
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
                    aria-label="Seleccionar todo"
                  />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Miembro Desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
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
                    <TableCell>{format(customer.signupDate, "dd MMM, yyyy", { locale: es })}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                           <DropdownMenuItem asChild>
                            <Link href={`/myoffice/admin/${customer.id}`} className="flex items-center cursor-pointer">
                              <Eye className="mr-2"/>Ver detalles
                            </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem>Enviar mensaje</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron resultados.
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
