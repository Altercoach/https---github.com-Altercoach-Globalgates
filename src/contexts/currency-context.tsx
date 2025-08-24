"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { Currency } from '@/lib/types';
import { CURRENCIES, LS_KEYS } from '@/lib/constants';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(() => {
     if (typeof window === 'undefined') return CURRENCIES[0];
    const storedCurrencyCode = localStorage.getItem(LS_KEYS.CURRENCY);
    return CURRENCIES.find(c => c.code === storedCurrencyCode) || CURRENCIES[0];
  });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
        localStorage.setItem(LS_KEYS.CURRENCY, currency.code);
    }
  }, [currency, isMounted]);

  const value = useMemo(() => ({
    currency,
    setCurrency: setCurrencyState,
  }), [currency]);
  
  if (!isMounted) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
