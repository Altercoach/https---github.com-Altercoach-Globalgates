
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language, Product } from '@/lib/types';
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
  const { site, isMounted: isSiteMounted } = useSite(); 
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);
  const [translatedSite, setTranslatedSite] = useState<SiteData>(site);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedLangCode = localStorage.getItem(LS_KEYS.LANGUAGE);
      const foundLang = LANGUAGES.find(l => l.code === storedLangCode);
      if(foundLang) setLanguageState(foundLang);
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

  const translateContent = useCallback(async (targetLanguage: Language, currentSite: SiteData) => {
    setIsTranslating(true);
    
    // The "site" object from useSite is always the source of truth, and is considered to be in English.
    const sourceSiteInEnglish = currentSite;
    
    if (targetLanguage.code === 'en') {
      setTranslatedSite(sourceSiteInEnglish);
      setIsTranslating(false);
      return;
    }

    try {
      // Exclude elements that shouldn't be translated.
      const { heroImage, ...brandContentToTranslate } = sourceSiteInEnglish.brand;
      const productsToTranslate = sourceSiteInEnglish.products.map(({ id, type, price, interval, features, badge, ...rest }) => rest);
      
      const payload = { 
          brand: brandContentToTranslate,
          services: sourceSiteInEnglish.services,
          products: productsToTranslate
      };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });
      
      const translatedData = JSON.parse(translatedJson || '{}') as Partial<Omit<SiteData, 'brand'> & { brand: Omit<SiteData['brand'], 'heroImage'> }>;

      // Re-assemble the final, translated site data
      // Start with the English source of truth to ensure all properties are present
      const finalTranslatedSite: SiteData = {
          ...sourceSiteInEnglish,
          brand: {
              ...(translatedData.brand || sourceSiteInEnglish.brand),
              heroImage: sourceSiteInEnglish.brand.heroImage, // Crucially, restore the user's hero image
          },
          services: translatedData.services || sourceSiteInEnglish.services,
          products: sourceSiteInEnglish.products.map((p, i) => ({
            ...p, // Keep original id, type, price, etc.
            ...(translatedData.products?.[i] || {}), // Overwrite with translated text content
            badge: p.badge // Keep original multi-language badge object
          })),
      };

      setTranslatedSite(finalTranslatedSite);

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Reverting to original.',
        variant: 'destructive',
      });
      setTranslatedSite(currentSite);
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  useEffect(() => {
    if(isMounted && isSiteMounted) {
        translateContent(language, site);
    }
  }, [language, site, translateContent, isMounted, isSiteMounted]);

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    translatedSite: translatedSite || site, 
    isTranslating,
  }), [language, translatedSite, isTranslating, site]);

  if (!isMounted || !isSiteMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
