
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
  // The state is now initialized directly from the imported object.
  // This ensures that when the file is updated, a page reload will show the new content.
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE_CONTENT);
  const [isMounted, setIsMounted] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // The main purpose of this effect is just to confirm the component has mounted on the client.
    setIsMounted(true);
  }, []);
  
  const value = useMemo(() => ({ site, setSite, isMounted, hasUnsavedChanges, setHasUnsavedChanges }), [site, isMounted, hasUnsavedChanges]);

  if (!isMounted) {
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
