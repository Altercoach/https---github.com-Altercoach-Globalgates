
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Receipt, TrendingUp, Settings, Link as LinkIcon, Download } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useCurrency } from '@/hooks/use-currency';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

const labels = {
  es: {
    pageTitle: "Pagos y Ventas",
    pageSubtitle: "Conecta tus pasarelas de pago y monitorea tus ingresos.",
    salesOverview: "Resumen de Ventas",
    totalRevenue: "Ingresos Totales",
    transactions: "Transacciones",
    avgSale: "Venta Promedio",
    last30Days: "Últimos 30 días",
    paymentGateways: "Pasarelas de Pago",
    gatewaysDesc: "Conecta tus cuentas para sincronizar tus datos de ventas.",
    connect: "Conectar",
    recentTransactions: "Transacciones Recientes",
    product: "Producto",
    amount: "Monto",
    date: "Fecha",
    status: "Estado",
    statusCompleted: "Completado",
    downloadInvoice: "Descargar Factura",
  },
  en: {
    pageTitle: "Payments & Sales",
    pageSubtitle: "Connect your payment gateways and monitor your revenue.",
    salesOverview: "Sales Overview",
    totalRevenue: "Total Revenue",
    transactions: "Transactions",
    avgSale: "Average Sale",
    last30Days: "Last 30 days",
    paymentGateways: "Payment Gateways",
    gatewaysDesc: "Connect your accounts to sync your sales data.",
    connect: "Connect",
    recentTransactions: "Recent Transactions",
    product: "Product",
    amount: "Amount",
    date: "Date",
    status: "Status",
    statusCompleted: "Completed",
    downloadInvoice: "Download Invoice",
  },
  fr: {
    pageTitle: "Paiements et Ventes",
    pageSubtitle: "Connectez vos passerelles de paiement et suivez vos revenus.",
    salesOverview: "Aperçu des Ventes",
    totalRevenue: "Revenu Total",
    transactions: "Transactions",
    avgSale: "Vente Moyenne",
    last30Days: "30 derniers jours",
    paymentGateways: "Passerelles de Paiement",
    gatewaysDesc: "Connectez vos comptes pour synchroniser vos données de vente.",
    connect: "Connecter",
    recentTransactions: "Transactions Récentes",
    product: "Produit",
    amount: "Montant",
    date: "Date",
    status: "Statut",
    statusCompleted: "Terminé",
    downloadInvoice: "Télécharger la Facture",
  }
};

const gateways = [
    { id: 'stripe', name: 'Stripe', logo: '/gateways/stripe.svg' },
    { id: 'paypal', name: 'PayPal', logo: '/gateways/paypal.svg' },
    { id: 'mercadopago', name: 'Mercado Pago', logo: '/gateways/mercadopago.svg' },
];

const transactionsData = [
    { id: 'txn_1', product: 'Dúo Conexión VIP', amount: 850, date: '2024-05-20', status: 'Completed' },
    { id: 'txn_2', product: 'Forja de Marca', amount: 750, date: '2024-05-18', status: 'Completed' },
    { id: 'txn_3', product: 'Paquete de Contenido 15', amount: 250, date: '2024-05-15', status: 'Completed' },
];

export default function CustomerPaymentsPage() {
    const { language } = useLanguage();
    const { currency } = useCurrency();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
    const avgSale = totalRevenue / transactionsData.length;

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
                            <p className="text-2xl font-bold">{transactionsData.length}</p>
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
                    {gateways.map(gateway => (
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
                    <CardTitle>{t.recentTransactions}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.product}</TableHead>
                                <TableHead>{t.amount}</TableHead>
                                <TableHead>{t.date}</TableHead>
                                <TableHead>{t.status}</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionsData.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="font-medium">{txn.product}</TableCell>
                                    <TableCell>{formatCurrency(txn.amount, currency)}</TableCell>
                                    <TableCell>{txn.date}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {t.statusCompleted}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
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
