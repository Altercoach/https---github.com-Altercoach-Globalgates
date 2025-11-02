
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

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE_CONTENT);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const saveSite = useCallback((updatedSite: SiteData) => {
    setSite(updatedSite);
    toast({
        title: "¡Cambios guardados!",
        description: "El contenido de tu sitio ha sido actualizado localmente. Estos cambios se escribirán permanentemente en el código fuente en la siguiente respuesta."
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
