
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language } from '@/lib/types';
import { LANGUAGES, LS_KEYS, DEFAULT_SITE } from '@/lib/constants';
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

  const translateContent = useCallback(async (targetLanguage: Language) => {
    // The default content in constants is now English, so it acts as the source of truth.
    const sourceSiteData = DEFAULT_SITE;
    
    if (targetLanguage.code === 'en') {
      // If the target is English, just use the default content.
      setTranslatedSite(sourceSiteData);
      return;
    }

    setIsTranslating(true);
    try {
      // Exclude the hero image from the translation payload to save tokens
      const { heroImage, ...siteContentToTranslate } = sourceSiteData.brand;
      const payload = { ...sourceSiteData, brand: siteContentToTranslate };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });
      
      const translatedData = JSON.parse(translatedJson || '{}') as SiteData;

      // Restore the hero image to the translated data
      if (translatedData.brand) {
        translatedData.brand.heroImage = sourceSiteData.brand.heroImage;
      }
      
      // Also, restore the user-defined hero image from the live `site` object
      if (site.brand.heroImage) {
        translatedData.brand.heroImage = site.brand.heroImage;
      }

      setTranslatedSite(translatedData);

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Please try again.',
        variant: 'destructive',
      });
      setTranslatedSite(sourceSiteData); // Revert to default
    } finally {
      setIsTranslating(false);
    }
  }, [toast, site.brand.heroImage]);

  useEffect(() => {
    if(isMounted) {
        // We always translate from the default English content
        translateContent(language);
    }
    // The dependency on `site` is removed to avoid re-translating when site data changes.
    // The translation is based on the default content, and dynamic user changes (like hero image)
    // are handled separately or will be reflected on next language change.
  }, [language, translateContent, isMounted]);

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
