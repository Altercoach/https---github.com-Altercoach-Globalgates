
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language } from '@/lib/types';
import { LANGUAGES, LS_KEYS } from '@/lib/constants';
import { translateSiteContent } from '@/ai/flows/translate-site-content';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translatedSite: SiteData;
  isTranslating: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);
  const [translatedContent, setTranslatedContent] = useState<Partial<SiteData>>(DEFAULT_SITE_CONTENT);
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

  const translate = useCallback(async (targetLanguage: Language) => {
    setIsTranslating(true);
    
    // Always translate from the default English content
    const sourceContent = DEFAULT_SITE_CONTENT;
    
    if (targetLanguage.code === 'en') {
      setTranslatedContent(sourceContent);
      setIsTranslating(false);
      return;
    }

    try {
      // Only translate fields that are meant to be translated, excluding user-generated content like brand name or hero title.
      // We will only translate the default service bullets and product notes/descriptions.
      const payload = {
        services: sourceContent.services.map(({ id, title, bullets }) => ({ id, title, bullets })),
        products: sourceContent.products.map(({ id, name, note, description, badge }) => ({ id, name, note, description, badge: badge.en })),
      };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });

      const translatedData = JSON.parse(translatedJson || '{}');
      
      const finalContent: Partial<SiteData> = {
        services: translatedData.services,
        products: sourceContent.products.map(p => {
          const translatedProd = translatedData.products?.find((tp: any) => tp.id === p.id);
          return translatedProd ? { ...p, note: translatedProd.note, description: translatedProd.description } : p;
        }),
      };
      
      setTranslatedContent(finalContent);

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Reverting to original.',
        variant: 'destructive',
      });
      setTranslatedContent(sourceContent);
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      translate(language);
    }
  }, [language, isMounted, translate]);

  const value = useMemo(() => {
    // This combines user's site data with the translated default content.
    // User-edited content (from SiteContext) is NOT translated and has priority.
    const site: SiteData = {
      ...DEFAULT_SITE_CONTENT,
      brand: DEFAULT_SITE_CONTENT.brand,
      services: translatedContent.services || DEFAULT_SITE_CONTENT.services,
      products: DEFAULT_SITE_CONTENT.products.map(defaultProd => {
        const translatedProd = translatedContent.products?.find(p => p.id === defaultProd.id);
        return {
          ...defaultProd,
          note: translatedProd?.note || defaultProd.note,
          description: translatedProd?.description || defaultProd.description,
        }
      })
    };

    return {
      language,
      setLanguage: setLanguageState,
      translatedSite: site,
      isTranslating,
    }
  }, [language, translatedContent, isTranslating]);

  if (!isMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
