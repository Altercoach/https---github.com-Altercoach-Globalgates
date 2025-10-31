
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
  const { site, isMounted: isSiteMounted } = useSite(); 
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
    setIsTranslating(true);

    // 1. Start with the default English content as the ultimate source of truth.
    const baseContent = { ...DEFAULT_SITE };

    // 2. Merge user's customizations from `currentSite` (live site data) into the base.
    // This ensures user edits are not lost.
    const siteToTranslate: SiteData = {
        ...baseContent,
        brand: {
            ...baseContent.brand,
            name: currentSite.brand.name,
            tagline: currentSite.brand.tagline,
            heroTitle: currentSite.brand.heroTitle,
            heroSubtitle: currentSite.brand.heroSubtitle,
            heroImage: currentSite.brand.heroImage,
        },
        services: currentSite.services,
        products: currentSite.products,
    };
    
    // 3. If target language is English, no translation is needed. Just use the merged content.
    if (targetLanguage.code === 'en') {
      setTranslatedSite(siteToTranslate);
      setIsTranslating(false);
      return;
    }

    // 4. For other languages, perform translation.
    try {
      const { heroImage, ...brandContentToTranslate } = siteToTranslate.brand;
      const payload: Omit<SiteData, 'brand'> & { brand: Omit<SiteData['brand'], 'heroImage'> } = { 
          ...siteToTranslate, 
          brand: brandContentToTranslate 
      };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });
      
      const translatedData = JSON.parse(translatedJson || '{}') as Partial<SiteData>;

      // 5. Re-assemble the final, translated site data
      const finalTranslatedSite: SiteData = {
          ...siteToTranslate, // Start with the merged base
          brand: {
              ...(translatedData.brand || siteToTranslate.brand),
              heroImage: currentSite.brand.heroImage, // Always preserve user's hero image
          },
          services: translatedData.services || siteToTranslate.services,
          products: translatedData.products || siteToTranslate.products,
      };

      setTranslatedSite(finalTranslatedSite);

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Reverting to original.',
        variant: 'destructive',
      });
      setTranslatedSite(currentSite); // Revert to user's current site on error
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
    translatedSite: translatedSite || site, // Fallback to site object
    isTranslating,
  }), [language, translatedSite, isTranslating, site]);

  if (!isMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
