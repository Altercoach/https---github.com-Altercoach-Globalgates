import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';

const cartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  type: z.enum(['one', 'sub']),
  qty: z.number().int().positive(),
  metadata: z
    .object({
      kind: z.literal('custom_package').optional(),
      brief: z.string().optional(),
      channels: z.array(z.string()).optional(),
      addons: z.array(z.string()).optional(),
      urgency: z.enum(['standard', 'priority', 'rush']).optional(),
      slaHours: z.number().int().positive().optional(),
      etaIso: z.string().optional(),
    })
    .optional(),
});

const purchaseOrderSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  invoiceNumber: z.string().optional(),
  status: z.enum(['paid', 'pending', 'failed']).optional(),
  syncState: z.enum(['synced', 'local_only']).optional(),
  customer: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      plan: z.string().optional(),
    })
    .optional(),
  fiscal: z
    .object({
      countryCode: z.string().min(2),
      taxRate: z.number().min(0),
      subtotal: z.number(),
      taxAmount: z.number(),
      grandTotal: z.number(),
    })
    .optional(),
  items: z.array(cartItemSchema).min(1),
  totals: z.object({
    oneTotal: z.number(),
    subTotal: z.number(),
    total: z.number().positive(),
  }),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = purchaseOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid order payload',
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  try {
    const db = getAdminFirestore();
    await db.collection('orders').doc(parsed.data.id).set({
      ...parsed.data,
      syncState: 'synced',
      source: 'web_checkout',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: parsed.data.id, syncState: 'synced' });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Could not persist order',
      },
      { status: 500 }
    );
  }
}
