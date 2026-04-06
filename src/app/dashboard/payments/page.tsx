'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Receipt, TrendingUp, Link as LinkIcon, Download } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useCurrency } from '@/hooks/use-currency';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { LS_KEYS } from '@/lib/constants';
import type { PurchaseOrder } from '@/lib/types';
import jsPDF from 'jspdf';
import { db, isFirebaseConfigured } from '@/lib/firebase-config';

const labels = {
  es: {
    pageTitle: 'Pagos y Ventas',
    pageSubtitle: 'Conecta tus pasarelas de pago y monitorea tus ingresos.',
    salesOverview: 'Resumen de Ventas',
    totalRevenue: 'Ingresos Totales',
    transactions: 'Transacciones',
    avgSale: 'Venta Promedio',
    paymentGateways: 'Pasarelas de Pago',
    gatewaysDesc: 'Conecta tus cuentas para sincronizar tus datos de ventas.',
    connect: 'Conectar',
    recentTransactions: 'Transacciones Recientes',
    product: 'Producto',
    amount: 'Monto',
    date: 'Fecha',
    status: 'Estado',
    statusCompleted: 'Completado',
    downloadInvoice: 'Descargar Factura',
    recentOrder: 'Pedido reciente',
    statusPaid: 'Pagado',
    invoiceNumber: 'Factura',
    customer: 'Cliente',
    exportCsv: 'Exportar CSV',
    monthlyReportCsv: 'Reporte mensual CSV',
  },
  en: {
    pageTitle: 'Payments & Sales',
    pageSubtitle: 'Connect your payment gateways and monitor your revenue.',
    salesOverview: 'Sales Overview',
    totalRevenue: 'Total Revenue',
    transactions: 'Transactions',
    avgSale: 'Average Sale',
    paymentGateways: 'Payment Gateways',
    gatewaysDesc: 'Connect your accounts to sync your sales data.',
    connect: 'Connect',
    recentTransactions: 'Recent Transactions',
    product: 'Product',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    statusCompleted: 'Completed',
    downloadInvoice: 'Download Invoice',
    recentOrder: 'Recent order',
    statusPaid: 'Paid',
    invoiceNumber: 'Invoice',
    customer: 'Customer',
    exportCsv: 'Export CSV',
    monthlyReportCsv: 'Monthly CSV report',
  },
  fr: {
    pageTitle: 'Paiements et Ventes',
    pageSubtitle: 'Connectez vos passerelles de paiement et suivez vos revenus.',
    salesOverview: 'Apercu des Ventes',
    totalRevenue: 'Revenu Total',
    transactions: 'Transactions',
    avgSale: 'Vente Moyenne',
    paymentGateways: 'Passerelles de Paiement',
    gatewaysDesc: 'Connectez vos comptes pour synchroniser vos donnees de vente.',
    connect: 'Connecter',
    recentTransactions: 'Transactions Recentes',
    product: 'Produit',
    amount: 'Montant',
    date: 'Date',
    status: 'Statut',
    statusCompleted: 'Termine',
    downloadInvoice: 'Telecharger la Facture',
    recentOrder: 'Commande recente',
    statusPaid: 'Paye',
    invoiceNumber: 'Facture',
    customer: 'Client',
    exportCsv: 'Exporter CSV',
    monthlyReportCsv: 'Rapport mensuel CSV',
  },
};

const gateways = [
  { id: 'stripe', name: 'Stripe', logo: '/gateways/stripe.svg' },
  { id: 'paypal', name: 'PayPal', logo: '/gateways/paypal.svg' },
  { id: 'mercadopago', name: 'Mercado Pago', logo: '/gateways/mercadopago.svg' },
];

const transactionsData = [
  { id: 'txn_1', product: 'Duo Conexion VIP', amount: 850, date: '2024-05-20', status: 'Completed' },
  { id: 'txn_2', product: 'Forja de Marca', amount: 750, date: '2024-05-18', status: 'Completed' },
  { id: 'txn_3', product: 'Paquete de Contenido 15', amount: 250, date: '2024-05-15', status: 'Completed' },
];

export default function CustomerPaymentsPage() {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  const [ordersHistory, setOrdersHistory] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const localFallback = () => {
        try {
          const rawHistory = localStorage.getItem(LS_KEYS.ORDERS_HISTORY);
          const rawLast = localStorage.getItem(LS_KEYS.LAST_ORDER);
          if (rawHistory) return JSON.parse(rawHistory) as PurchaseOrder[];
          if (rawLast) return [JSON.parse(rawLast) as PurchaseOrder];
        } catch {
          // ignore local parse issues
        }
        return [] as PurchaseOrder[];
      };

      if (isFirebaseConfigured() && db) {
        try {
          const snap = await db.collection('orders').orderBy('createdAt', 'desc').limit(200).get();
          const remote = snap.docs.map((d) => d.data() as PurchaseOrder);
          const local = localFallback();
          const mergedMap = new Map<string, PurchaseOrder>();
          for (const order of [...remote, ...local]) {
            mergedMap.set(order.id, order);
          }
          setOrdersHistory(
            Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
          return;
        } catch {
          // fallback to local history
        }
      }

      setOrdersHistory(localFallback());
    };

    void loadOrders();
  }, []);

  const handleExportCsv = () => {
    if (ordersHistory.length === 0) return;
    const header = [
      'invoice_number',
      'order_id',
      'created_at',
      'status',
      'customer_email',
      'one_total',
      'sub_total',
      'grand_total',
      'sync_state',
    ];
    const rows = ordersHistory.map((order) => [
      order.invoiceNumber ?? '',
      order.id,
      order.createdAt,
      order.status ?? 'paid',
      order.customer?.email ?? '',
      String(order.totals.oneTotal),
      String(order.totals.subTotal),
      String(order.fiscal?.grandTotal ?? order.totals.total),
      order.syncState ?? 'local_only',
    ]);
    const csv = [header, ...rows]
      .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleMonthlyServerCsv = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const res = await fetch(`/api/reports/orders/monthly?year=${year}&month=${month}&format=csv`);
    if (!res.ok) return;
    const csv = await res.text();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `orders-server-${year}-${String(month).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const lastOrder = ordersHistory[0] ?? null;

  const recentTransactionRows = useMemo(() => {
    const orderRows = ordersHistory.map((order) => ({
      id: order.id,
      product: `${t.recentOrder} (${order.items.length})`,
      amount: order.fiscal?.grandTotal ?? order.totals.total,
      date: new Date(order.createdAt).toISOString().slice(0, 10),
      status: order.status ?? 'paid',
    }));
    return [...orderRows, ...transactionsData];
  }, [ordersHistory, t.recentOrder]);

  const totalRevenue = recentTransactionRows.reduce((sum, trx) => sum + trx.amount, 0);
  const avgSale = totalRevenue / recentTransactionRows.length;

  const handleDownloadInvoice = (txnId: string) => {
    const order = ordersHistory.find((o) => o.id === txnId);
    if (!order) return;

    const invoiceId = order.invoiceNumber ?? `inv_${order.id}`;
    const doc = new jsPDF();
    let y = 14;

    doc.setFontSize(16);
    doc.text('Goldek Key International - Invoice', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoiceId}`, 14, y);
    y += 6;
    doc.text(`Order ID: ${order.id}`, 14, y);
    y += 6;
    doc.text(`Issued: ${new Date().toLocaleString()}`, 14, y);
    y += 6;
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 14, y);
    y += 6;
    doc.text(`Customer: ${order.customer?.name || '-'} <${order.customer?.email || '-'}>`, 14, y);
    y += 6;
    doc.text(`Fiscal country: ${order.fiscal?.countryCode || '-'}`, 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text('Items', 14, y);
    y += 6;

    doc.setFontSize(10);
    for (const item of order.items) {
      const line = `- ${item.name} x${item.qty} | ${item.type} | ${formatCurrency(item.price * item.qty, currency)}`;
      const wrapped = doc.splitTextToSize(line, 180);
      doc.text(wrapped, 14, y);
      y += wrapped.length * 5;

      if (item.metadata?.kind === 'custom_package') {
        const metaLine = `  Brief: ${item.metadata.brief || '-'} | SLA: ${item.metadata.slaHours || '-'}h | ETA: ${item.metadata.etaIso ? new Date(item.metadata.etaIso).toLocaleString() : '-'}`;
        const metaWrapped = doc.splitTextToSize(metaLine, 178);
        doc.text(metaWrapped, 16, y);
        y += metaWrapped.length * 5;
      }

      if (y > 270) {
        doc.addPage();
        y = 14;
      }
    }

    y += 4;
    doc.setFontSize(11);
    doc.text(`One-time total: ${formatCurrency(order.totals.oneTotal, currency)}`, 14, y);
    y += 6;
    doc.text(`Subscriptions total: ${formatCurrency(order.totals.subTotal, currency)}`, 14, y);
    y += 6;
    doc.text(`Subtotal: ${formatCurrency(order.fiscal?.subtotal ?? order.totals.total, currency)}`, 14, y);
    y += 6;
    doc.text(
      `Taxes (${Math.round((order.fiscal?.taxRate ?? 0) * 100)}%): ${formatCurrency(order.fiscal?.taxAmount ?? 0, currency)}`,
      14,
      y
    );
    y += 6;
    doc.text(`Grand total: ${formatCurrency(order.fiscal?.grandTotal ?? order.totals.total, currency)}`, 14, y);

    doc.save(`${invoiceId}.pdf`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageSubtitle}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t.salesOverview}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary"><DollarSign /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t.totalRevenue}</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary"><Receipt /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t.transactions}</p>
              <p className="text-2xl font-bold">{recentTransactionRows.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary"><TrendingUp /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t.avgSale}</p>
              <p className="text-2xl font-bold">{formatCurrency(avgSale, currency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.paymentGateways}</CardTitle>
          <CardDescription>{t.gatewaysDesc}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.map((gateway) => (
            <div key={gateway.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src={gateway.logo} alt={gateway.name} width={40} height={40} className="object-contain" />
                <h3 className="font-semibold">{gateway.name}</h3>
              </div>
              <Button variant="outline" size="sm">
                <LinkIcon className="mr-2 h-4 w-4" />
                {t.connect}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{t.recentTransactions}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={ordersHistory.length === 0}>
                {t.exportCsv}
              </Button>
              <Button variant="outline" size="sm" onClick={handleMonthlyServerCsv}>
                {t.monthlyReportCsv}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.product}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.invoiceNumber}</TableHead>
                <TableHead>{t.customer}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactionRows.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.product}</TableCell>
                  <TableCell>{formatCurrency(txn.amount, currency)}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{ordersHistory.find((o) => o.id === txn.id)?.invoiceNumber ?? '-'}</TableCell>
                  <TableCell>{ordersHistory.find((o) => o.id === txn.id)?.customer?.email ?? '-'}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {txn.id === lastOrder?.id ? t.statusPaid : (txn.status === 'Completed' ? t.statusCompleted : txn.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(txn.id)}
                      disabled={!ordersHistory.some((o) => o.id === txn.id)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">{t.downloadInvoice}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
