
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData } from '@/lib/types';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';
import { useToast } from '@/hooks/use-toast';

interface SiteContextType {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
  saveSite: (updatedSite: SiteData) => void;
  isMounted: boolean;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Helper function to format the site data back into a TS file content
const formatSiteDataForSaving = (data: SiteData): string => {
  const jsonString = JSON.stringify(data, null, 2);
  return `
import type { SiteData } from '@/lib/types';

export const DEFAULT_SITE_CONTENT: SiteData = ${jsonString};
`.trim();
};


export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE_CONTENT);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const saveSite = useCallback((updatedSite: SiteData) => {
    // We are now directly updating the state which will be used to generate the file content.
    // The concept of saving to localStorage is removed to ensure persistence.
    setSite(updatedSite);

    // This toast is for user feedback in the UI. The actual file writing
    // is handled by the XML output of the AI.
    toast({
        title: "¡Cambios guardados!",
        description: "El contenido de tu sitio ha sido actualizado."
    });
  }, [toast]);
  
  const value = useMemo(() => ({ site, setSite, saveSite, isMounted }), [site, saveSite, isMounted]);

  if (!isMounted) {
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}

    