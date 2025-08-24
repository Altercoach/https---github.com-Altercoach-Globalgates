
"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { SiteData } from '@/lib/types';
import { DEFAULT_SITE, LS_KEYS } from '@/lib/constants';

interface SiteContextType {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
  isMounted: boolean;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  const [site, setSite] = useState<SiteData>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_SITE;
    }
    try {
      const raw = localStorage.getItem(LS_KEYS.SITE);
      const parsed = raw ? JSON.parse(raw) : DEFAULT_SITE;
      // Basic validation to ensure we don't load corrupted data
      if (parsed && parsed.brand && parsed.services && parsed.products) {
        return parsed;
      }
      return DEFAULT_SITE;
    } catch {
      return DEFAULT_SITE;
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LS_KEYS.SITE, JSON.stringify(site));
      } catch (e) {
        console.error("Failed to save site data to localStorage", e);
      }
    }
  }, [site, isMounted]);
  
  const value = useMemo(() => ({ site, setSite, isMounted }), [site, isMounted]);

  if (!isMounted) {
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
