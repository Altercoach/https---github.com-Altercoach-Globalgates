"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { SiteData } from '@/lib/types';
import { DEFAULT_SITE, LS_KEYS } from '@/lib/constants';

type Theme = 'light' | 'dark';

interface SiteContextType {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
      return raw ? JSON.parse(raw) : DEFAULT_SITE;
    } catch {
      return DEFAULT_SITE;
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    try {
      return (localStorage.getItem(LS_KEYS.THEME) as Theme) || 'light';
    } catch {
      return 'light';
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

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LS_KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
    }
  }, [theme, isMounted]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = useMemo(() => ({ site, setSite, theme, setTheme, isMounted }), [site, theme, isMounted]);

  if (!isMounted) {
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
