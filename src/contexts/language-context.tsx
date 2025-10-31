
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language, MultilingualString } from '@/lib/types';
import { LANGUAGES, LS_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useSite } from '@/hooks/use-site';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getTranslation: <T extends string | MultilingualString | MultilingualString[]>(content: T) => T extends any[] ? string[] : string;
  isTranslating: boolean; // Kept for UI feedback, though no AI calls are made.
  translatedSite: SiteData | null; // This will hold the site content in the selected language
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { site, isMounted: isSiteMounted } = useSite();
  const { toast } = useToast();
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [translatedSite, setTranslatedSite] = useState<SiteData | null>(null);

  useEffect(() => {
    try {
      const storedLangCode = localStorage.getItem(LS_KEYS.LANGUAGE) as Language['code'];
      const foundLang = LANGUAGES.find(l => l.code === storedLangCode);
      if (foundLang) setLanguageState(foundLang);
    } catch {
      // Ignore errors
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LS_KEYS.LANGUAGE, language.code);
    }
  }, [language, isMounted]);

  const getTranslation = useCallback(<T extends string | MultilingualString | MultilingualString[]>(content: T): T extends any[] ? string[] : string => {
    const langCode = language.code;
    
    if (typeof content === 'string') {
        return content as any;
    }

    if (Array.isArray(content)) {
        return content.map(item => {
            if (typeof item === 'object' && item !== null && langCode in item) {
                return (item as MultilingualString)[langCode];
            }
            // Fallback for array elements that might not be multilingual strings
            return item; 
        }) as any;
    }

    if (typeof content === 'object' && content !== null && langCode in content) {
        return (content as MultilingualString)[langCode] as any;
    }

    // Fallback for safety, though with proper types this shouldn't be hit often.
    if (typeof content === 'object' && content !== null) {
      const fallbackLang = 'en' as const;
      if (fallbackLang in content) {
        return (content as MultilingualString)[fallbackLang] as any;
      }
    }
    
    return '' as any;
  }, [language.code]);

  useEffect(() => {
    if (site) {
      const translated: SiteData = {
        ...site,
        brand: {
          ...site.brand,
          name: getTranslation(site.brand.name),
          tagline: getTranslation(site.brand.tagline),
          heroTitle: getTranslation(site.brand.heroTitle),
          heroSubtitle: getTranslation(site.brand.heroSubtitle),
        },
        services: site.services.map(service => ({
          ...service,
          title: getTranslation(service.title),
          bullets: getTranslation(service.bullets),
        })),
        products: site.products.map(product => ({
          ...product,
          name: getTranslation(product.name),
          badge: getTranslation(product.badge),
          note: getTranslation(product.note),
          description: getTranslation(product.description),
        }))
      };
      setTranslatedSite(translated);
    }
  }, [site, language, getTranslation]);


  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    getTranslation,
    isTranslating: false,
    translatedSite,
  }), [language, getTranslation, translatedSite]);

  if (!isMounted || !isSiteMounted || !translatedSite) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
