
"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { SiteData } from '@/lib/types';
import { LS_KEYS } from '@/lib/constants';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';

interface SiteContextType {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
  isMounted: boolean;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // The state is now initialized directly from the imported default content.
  // localStorage is now only for temporary edits in the live preview.
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE_CONTENT);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted after the initial render to avoid hydration issues,
    // but we no longer read from localStorage here.
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // This effect still saves to localStorage, allowing for temporary live edits,
    // but it no longer affects the initial state on page load.
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
    // Return null on the server and during the initial client render
    // to prevent hydration mismatches.
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
