
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CartItem, PurchaseOrder } from '@/lib/types';
import { LS_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const clampQty = (n: number) => Math.max(1, Math.min(99, Number.isFinite(n) ? Math.floor(n) : 1));

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    type: 'one' | 'sub';
    interval?: 'month' | null;
    metadata?: CartItem['metadata'];
  }) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  totals: { oneTotal: number; subTotal: number; total: number };
  checkout: () => Promise<void>;
  hasPurchased: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(LS_KEYS.CART);
      if (rawCart) setCart(JSON.parse(rawCart));
      
      const rawPurchased = localStorage.getItem(LS_KEYS.PURCHASED);
      if (rawPurchased) setHasPurchased(rawPurchased === '1');
    } catch {
      // Ignore errors
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
      localStorage.setItem(LS_KEYS.PURCHASED, hasPurchased ? '1' : '0');
    }
  }, [cart, hasPurchased, isMounted]);

  const addToCart = useCallback((prod: {
    id: string;
    name: string;
    price: number;
    type: 'one' | 'sub' | 'info';
    interval?: 'month' | null;
    metadata?: CartItem['metadata'];
  }) => {
    if (prod.type === 'info') {
      toast({
        title: 'Plan Informativo',
        description: 'Este es un plan informativo. Contáctanos para activarlo.',
      });
      return;
    }

    setCart((prev) => {
      const exists = prev.find((x) => x.id === prod.id);
      if (exists) {
        if (exists.type === 'sub') {
          toast({ description: 'La suscripción ya está en tu carrito.' });
          return prev;
        }
        return prev.map((x) =>
          x.id === prod.id ? { ...x, qty: clampQty(x.qty + 1) } : x
        );
      }
      return [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          type: prod.type as 'one' | 'sub',
          qty: 1,
          metadata: prod.metadata,
        },
      ];
    });
    
    toast({ description: 'Añadido al carrito.' });
    setIsCartOpen(true);
  }, [toast]);

  const removeFromCart = useCallback((id: string) => setCart((prev) => prev.filter((x) => x.id !== id)), []);
  
  const setQty = useCallback((id: string, qty: number) => {
    const safeQty = clampQty(qty);
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: safeQty } : x)));
  }, []);

  const totals = useMemo(() => {
    const one = cart.filter((i) => i.type === 'one');
    const sub = cart.filter((i) => i.type === 'sub');
    const oneTotal = one.reduce((s, i) => s + (i.price * i.qty), 0);
    const subTotal = sub.reduce((s, i) => s + i.price, 0);
    return { oneTotal, subTotal, total: oneTotal + subTotal };
  }, [cart]);

  const checkout = useCallback(async () => {
    try {
      if (totals.total <= 0) {
        toast({ title: 'Tu carrito está vacío.' });
        return;
      }
      await new Promise((res) => setTimeout(res, 600));

      const now = new Date();
      const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const invoiceSeqKey = `${LS_KEYS.INVOICE_SEQ_PREFIX}_${yyyymm}`;
      let invoiceSeq = 1;
      try {
        const rawSeq = localStorage.getItem(invoiceSeqKey);
        invoiceSeq = rawSeq ? Math.max(1, Number(rawSeq) + 1) : 1;
      } catch {
        invoiceSeq = 1;
      }
      const invoiceNumber = `GG-${yyyymm}-${String(invoiceSeq).padStart(6, '0')}`;

      let customerEmail: string | undefined;
      let customerPlan: string | undefined;
      let customerName: string | undefined;
      let billingCountry = 'MX';
      try {
        const rawAuth = localStorage.getItem(LS_KEYS.AUTH);
        if (rawAuth) {
          const parsed = JSON.parse(rawAuth) as { user?: { email?: string; plan?: string } };
          customerEmail = parsed.user?.email;
          customerPlan = parsed.user?.plan;
          if (customerEmail) {
            customerName = customerEmail.split('@')[0];
          }
        }
        const rawBillingCountry = localStorage.getItem(LS_KEYS.BILLING_COUNTRY);
        if (rawBillingCountry?.trim()) {
          billingCountry = rawBillingCountry.trim().toUpperCase();
        }
      } catch {
        // Ignore auth parsing errors
      }

      const taxRates: Record<string, number> = {
        MX: 0.16,
        ES: 0.21,
        FR: 0.20,
        US: 0,
      };
      const taxRate = taxRates[billingCountry] ?? 0;
      const subtotal = totals.total;
      const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
      const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

      const orderSnapshot: PurchaseOrder = {
        id: `ord_${Date.now()}`,
        createdAt: new Date().toISOString(),
        invoiceNumber,
        status: 'paid',
        syncState: 'local_only',
        customer: {
          name: customerName,
          email: customerEmail,
          plan: customerPlan,
        },
        fiscal: {
          countryCode: billingCountry,
          taxRate,
          subtotal,
          taxAmount,
          grandTotal,
        },
        items: cart,
        totals,
      };

      // Best-effort sync via server API backed by Firebase Admin SDK.
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderSnapshot),
        });

        if (response.ok) {
          orderSnapshot.syncState = 'synced';
        } else {
          const payload = await response.json().catch(() => null);
          console.warn('order_sync_failed', payload?.error ?? response.statusText);
        }
      } catch (syncError) {
        console.warn('order_sync_failed', syncError);
      }

      localStorage.setItem(LS_KEYS.LAST_ORDER, JSON.stringify(orderSnapshot));
      localStorage.setItem(invoiceSeqKey, String(invoiceSeq));
      try {
        const rawHistory = localStorage.getItem(LS_KEYS.ORDERS_HISTORY);
        const history = rawHistory ? (JSON.parse(rawHistory) as PurchaseOrder[]) : [];
        const next = [orderSnapshot, ...history].slice(0, 200);
        localStorage.setItem(LS_KEYS.ORDERS_HISTORY, JSON.stringify(next));
      } catch {
        // Ignore history persistence errors
      }
      setHasPurchased(true);
      setCart([]);
      setIsCartOpen(false);
      toast({
        title: '¡Pago Exitoso!',
        description: 'Ahora puedes crear tu cuenta.',
      });
      router.push('/signup');
    } catch (err) {
      console.error('checkout', err);
      toast({ title: 'Error procesando el pago', variant: 'destructive' });
    }
  }, [cart, totals, toast, router]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    setQty,
    totals,
    checkout,
    hasPurchased,
    isCartOpen,
    setIsCartOpen,
  }), [cart, addToCart, removeFromCart, setQty, totals, checkout, hasPurchased, isCartOpen, setIsCartOpen]);
  
  if (!isMounted) {
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
