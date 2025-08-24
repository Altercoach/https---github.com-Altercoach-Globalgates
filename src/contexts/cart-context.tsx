"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CartItem, Product } from '@/lib/types';
import { LS_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

const clampQty = (n: number) => Math.max(1, Math.min(99, Number.isFinite(n) ? Math.floor(n) : 1));

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
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
  const { translatedSite } = useLanguage();

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LS_KEYS.CART);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [hasPurchased, setHasPurchased] = useState<boolean>(() => {
     if (typeof window === 'undefined') return false;
    return localStorage.getItem(LS_KEYS.PURCHASED) === '1';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEYS.PURCHASED, hasPurchased ? '1' : '0');
    }
  }, [hasPurchased]);

  const addToCart = useCallback((prod: Product) => {
    if (!prod || prod.type === 'info') {
      toast({
        title: 'Informational Plan',
        description: 'This is an informational plan. Contact us to activate it.',
      });
      return;
    }

    setCart((prev) => {
      const exists = prev.find((x) => x.id === prod.id);
      if (exists) {
        return prev.map((x) =>
          x.id === prod.id ? { ...x, qty: prod.type === 'sub' ? 1 : clampQty((x.qty || 1) + 1) } : x
        );
      }
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, type: prod.type, interval: prod.interval || null, qty: 1 }];
    });
    
    toast({ description: 'Added to cart.' });
    setIsCartOpen(true);
  }, [toast]);

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((x) => x.id !== id));
  const setQty = (id: string, qty: number) => setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: clampQty(qty) } : x)));

  const totals = useMemo(() => {
    const one = cart.filter((i) => i.type === 'one');
    const sub = cart.filter((i) => i.type === 'sub');
    const oneTotal = one.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
    const subTotal = sub.reduce((s, i) => s + i.price, 0);
    return { oneTotal, subTotal, total: oneTotal + subTotal };
  }, [cart]);

  const checkout = async () => {
    try {
      if (totals.total <= 0) {
        toast({ title: 'Your cart is empty.' });
        return;
      }
      await new Promise((res) => setTimeout(res, 600));
      setHasPurchased(true);
      setCart([]);
      setIsCartOpen(false);
      toast({
        title: 'Payment Successful!',
        description: 'You can now create your account.',
      });
      router.push('/signup');
    } catch (err) {
      console.error('checkout', err);
      toast({ title: 'Error processing payment', variant: 'destructive' });
    }
  };

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
  }), [cart, addToCart, totals, checkout, hasPurchased, isCartOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
