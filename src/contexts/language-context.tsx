
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language } from '@/lib/types';
import { LANGUAGES, LS_KEYS } from '@/lib/constants';
import { translateSiteContent } from '@/ai/flows/translate-site-content';
import { useToast } from '@/hooks/use-toast';
import { useSite } from '@/hooks/use-site';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translatedSite: SiteData;
  isTranslating: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { site } = useSite(); 
  const [isMounted, setIsMounted] = useState(false);
  
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return LANGUAGES[0];
    const storedLangCode = localStorage.getItem(LS_KEYS.LANGUAGE);
    return LANGUAGES.find(l => l.code === storedLangCode) || LANGUAGES[0];
  });
  
  const [translatedSite, setTranslatedSite] = useState<SiteData>(site);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LS_KEYS.LANGUAGE, language.code);
    }
  }, [language, isMounted]);

  const translateContent = useCallback(async (targetLanguage: Language, currentSite: SiteData) => {
    if (targetLanguage.code === 'es') {
      setTranslatedSite(currentSite);
      return;
    }
    setIsTranslating(true);
    try {
      // Exclude the hero image from the translation payload to save tokens
      const { heroImage, ...siteContentToTranslate } = currentSite.brand;
      const payload = { ...currentSite, brand: siteContentToTranslate };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });
      
      const translatedData = JSON.parse(translatedJson || '{}') as SiteData;

      // Restore the hero image to the translated data
      if (translatedData.brand) {
        translatedData.brand.heroImage = currentSite.brand.heroImage;
      }

      setTranslatedSite(translatedData);

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Please try again.',
        variant: 'destructive',
      });
      setTranslatedSite(currentSite); // Revert to current site
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    if(isMounted) {
      translateContent(language, site);
    }
  }, [language, site, translateContent, isMounted]);

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    translatedSite,
    isTranslating,
  }), [language, translatedSite, isTranslating]);

  if (!isMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
