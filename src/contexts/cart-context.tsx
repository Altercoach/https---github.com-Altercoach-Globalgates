
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CartItem } from '@/lib/types';
import { LS_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const clampQty = (n: number) => Math.max(1, Math.min(99, Number.isFinite(n) ? Math.floor(n) : 1));

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; type: 'one' | 'sub'; interval?: 'month' | null }) => void;
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

  const addToCart = useCallback((prod: { id: string; name: string; price: number; type: 'one' | 'sub' | 'info'; interval?: 'month' | null }) => {
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
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, type: prod.type as 'one' | 'sub', qty: 1 }];
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
  }, [totals.total, toast, router]);

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
