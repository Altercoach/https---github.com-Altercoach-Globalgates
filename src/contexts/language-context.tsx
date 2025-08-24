"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language } from '@/lib/types';
import { DEFAULT_SITE, LANGUAGES, LS_KEYS } from '@/lib/constants';
import { translateSiteContent } from '@/ai/flows/translate-site-content';
import { useToast } from '@/hooks/use-toast';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translatedSite: SiteData;
  isTranslating: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return LANGUAGES[0];
    const storedLangCode = localStorage.getItem(LS_KEYS.LANGUAGE);
    return LANGUAGES.find(l => l.code === storedLangCode) || LANGUAGES[0];
  });
  
  const [translatedSite, setTranslatedSite] = useState<SiteData>(DEFAULT_SITE);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEYS.LANGUAGE, language.code);
    }
  }, [language]);

  const translateContent = useCallback(async (targetLanguage: Language) => {
    if (targetLanguage.code === 'es') {
      setTranslatedSite(DEFAULT_SITE);
      return;
    }
    setIsTranslating(true);
    try {
      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(DEFAULT_SITE),
        targetLanguage: targetLanguage.code,
      });
      setTranslatedSite(JSON.parse(translatedJson));
    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Please try again.',
        variant: 'destructive',
      });
      setTranslatedSite(DEFAULT_SITE); // Revert to default
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    translateContent(language);
  }, [language, translateContent]);

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    translatedSite,
    isTranslating,
  }), [language, translatedSite, isTranslating]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
