import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { db, isFirebaseConfigured } from '@/lib/firebase-config';
import type { PurchaseOrder } from '@/lib/types';

function buildCsv(orders: PurchaseOrder[]) {
  const header = [
    'invoice_number',
    'order_id',
    'created_at',
    'status',
    'sync_state',
    'customer_email',
    'country_code',
    'tax_rate',
    'subtotal',
    'tax_amount',
    'grand_total',
  ];

  const rows = orders.map((o) => [
    o.invoiceNumber ?? '',
    o.id,
    o.createdAt,
    o.status ?? 'paid',
    o.syncState ?? 'local_only',
    o.customer?.email ?? '',
    o.fiscal?.countryCode ?? '',
    String(o.fiscal?.taxRate ?? 0),
    String(o.fiscal?.subtotal ?? o.totals.total),
    String(o.fiscal?.taxAmount ?? 0),
    String(o.fiscal?.grandTotal ?? o.totals.total),
  ]);

  return [header, ...rows]
    .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

function buildSummary(orders: PurchaseOrder[], year: number, month: number) {
  return {
    year,
    month,
    totalOrders: orders.length,
    paidOrders: orders.filter((o) => (o.status ?? 'paid') === 'paid').length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    failedOrders: orders.filter((o) => o.status === 'failed').length,
    syncedOrders: orders.filter((o) => o.syncState === 'synced').length,
    localOnlyOrders: orders.filter((o) => o.syncState !== 'synced').length,
    subtotal: orders.reduce((sum, o) => sum + (o.fiscal?.subtotal ?? o.totals.total), 0),
    taxes: orders.reduce((sum, o) => sum + (o.fiscal?.taxAmount ?? 0), 0),
    grandTotal: orders.reduce((sum, o) => sum + (o.fiscal?.grandTotal ?? o.totals.total), 0),
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const year = Number(url.searchParams.get('year'));
  const month = Number(url.searchParams.get('month')); // 1-12
  const format = (url.searchParams.get('format') || 'json').toLowerCase();

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Invalid year/month. Use ?year=2026&month=4' }, { status: 400 });
  }

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const emptySummary = {
    year,
    month,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
    syncedOrders: 0,
    localOnlyOrders: 0,
    subtotal: 0,
    taxes: 0,
    grandTotal: 0,
  };

  const emptyCsv = buildCsv([]);

  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('orders')
      .where('createdAt', '>=', start.toISOString())
      .where('createdAt', '<', end.toISOString())
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snap.docs.map((d) => d.data() as PurchaseOrder);
    const summary = buildSummary(orders, year, month);

    if (format === 'csv') {
      const csv = buildCsv(orders);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="orders-${year}-${String(month).padStart(2, '0')}.csv"`,
        },
      });
    }

    return NextResponse.json({ summary, orders });
  } catch (adminError) {
    // Secondary path: try Firebase client SDK (works if Firestore rules allow server-side reads).
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await db
          .collection('orders')
          .where('createdAt', '>=', start.toISOString())
          .where('createdAt', '<', end.toISOString())
          .orderBy('createdAt', 'desc')
          .get();

        const orders = snap.docs.map((d) => d.data() as PurchaseOrder);
        const summary = buildSummary(orders, year, month);

        if (format === 'csv') {
          const csv = buildCsv(orders);
          return new NextResponse(csv, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="orders-${year}-${String(month).padStart(2, '0')}.csv"`,
              'x-report-source': 'firebase-client-fallback',
            },
          });
        }

        return NextResponse.json({ summary, orders, source: 'firebase-client-fallback' });
      } catch (clientError) {
        if (format === 'csv') {
          return new NextResponse(emptyCsv, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="orders-${year}-${String(month).padStart(2, '0')}.csv"`,
              'x-report-warning': clientError instanceof Error ? clientError.message : 'fallback_no_credentials',
            },
          });
        }

        return NextResponse.json({
          summary: emptySummary,
          orders: [],
          warning: clientError instanceof Error ? clientError.message : 'fallback_no_credentials',
        });
      }
    }

    // Graceful degradation: return empty report when no read path is available.
    if (format === 'csv') {
      return new NextResponse(emptyCsv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="orders-${year}-${String(month).padStart(2, '0')}.csv"`,
          'x-report-warning': adminError instanceof Error ? adminError.message : 'fallback_no_admin_credentials',
        },
      });
    }

    return NextResponse.json({
      summary: emptySummary,
      orders: [],
      warning: adminError instanceof Error ? adminError.message : 'fallback_no_admin_credentials',
    });
  }
}
