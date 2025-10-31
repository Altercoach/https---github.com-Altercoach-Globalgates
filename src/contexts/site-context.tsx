
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
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.SITE);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Basic validation to ensure we don't load corrupted data
        if (parsed && parsed.brand && parsed.services && parsed.products) {
          setSite(parsed);
        }
      }
    } catch {
      // Ignore parsing errors and keep default site data
    }
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
