
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData } from '@/lib/types';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';

interface SiteContextType {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
  isMounted: boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from the imported object. This allows for hot-reloading of content.
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE_CONTENT);
  const [isMounted, setIsMounted] = useState(false);
  // The concept of "unsaved changes" is removed as we move back to a real-time update model.
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSetSite = useCallback((updater: React.SetStateAction<SiteData>) => {
    // We set a flag for unsaved changes whenever the site data is modified.
    setHasUnsavedChanges(true);
    setSite(updater);
  }, []);

  const value = useMemo(() => ({ 
    site, 
    setSite: handleSetSite, 
    isMounted,
    hasUnsavedChanges,
    setHasUnsavedChanges // Still provide this for now to avoid breaking components that use it
  }), [site, isMounted, hasUnsavedChanges, handleSetSite]);

  if (!isMounted) {
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
