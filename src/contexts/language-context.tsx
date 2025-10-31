
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language } from '@/lib/types';
import { LANGUAGES, LS_KEYS } from '@/lib/constants';
import { translateSiteContent } from '@/ai/flows/translate-site-content';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';
import { useSite } from '@/hooks/use-site';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translatedSite: SiteData;
  isTranslating: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { site: liveSite, isMounted: isSiteMounted } = useSite();
  const { toast } = useToast();
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);
  const [translatedSite, setTranslatedSite] = useState<SiteData>(liveSite);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedLangCode = localStorage.getItem(LS_KEYS.LANGUAGE);
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

  const translate = useCallback(async (siteContent: SiteData, targetLanguage: Language) => {
    setIsTranslating(true);
    try {
      const payload = {
        brand: {
          name: siteContent.brand.name,
          tagline: siteContent.brand.tagline,
          heroTitle: siteContent.brand.heroTitle,
          heroSubtitle: siteContent.brand.heroSubtitle,
        },
        services: siteContent.services.map(({ id, title, bullets }) => ({ id, title, bullets })),
        products: siteContent.products.map(({ id, name, note, description, badge }) => ({ id, name, note, description, badge })),
      };

      // If target is Spanish (the source language of user content), just use the live site data.
      if (targetLanguage.code === 'es') {
        setTranslatedSite(siteContent);
        return;
      }
      
      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });

      const translatedData = JSON.parse(translatedJson || '{}');
      
      const finalContent: SiteData = {
        ...siteContent,
        brand: {
          ...siteContent.brand,
          ...translatedData.brand,
        },
        services: siteContent.services.map(s => {
          const translatedSvc = translatedData.services?.find((ts: any) => ts.id === s.id);
          return translatedSvc ? { ...s, ...translatedSvc } : s;
        }),
        products: siteContent.products.map(p => {
          const translatedProd = translatedData.products?.find((tp: any) => tp.id === p.id);
          const badge = translatedProd?.badge?.[targetLanguage.code as keyof typeof translatedProd.badge] || p.badge[targetLanguage.code as keyof typeof p.badge];
          return translatedProd ? { ...p, ...translatedProd, badge: { ...p.badge, [targetLanguage.code]: badge } } : p;
        }),
      };
      
      setTranslatedSite(finalContent);

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Reverting to original.',
        variant: 'destructive',
      });
      setTranslatedSite(siteContent); // Fallback to user's content
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted && isSiteMounted) {
      translate(liveSite, language);
    }
  }, [language, liveSite, isMounted, isSiteMounted, translate]);

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    translatedSite: translatedSite,
    isTranslating,
  }), [language, translatedSite, isTranslating]);

  if (!isMounted || !isSiteMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
