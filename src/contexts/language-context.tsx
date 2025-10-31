
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
    
    // Create a base site object by merging default content with user's live customizations.
    // This ensures user edits are always the source of truth for translation.
    const siteToTranslate: SiteData = {
        ...DEFAULT_SITE, // Start with default structure
        brand: {
            ...DEFAULT_SITE.brand, // Start with default brand
            ...currentSite.brand // Overwrite with user's live data
        },
        services: currentSite.services, // Use user's live services
        products: currentSite.products, // Use user's live products
    };
    
    if (targetLanguage.code === 'en') {
      setTranslatedSite(siteToTranslate);
      setIsTranslating(false);
      return;
    }

    try {
      // Exclude heroImage from the translation payload as it's just a URL.
      const { heroImage, ...brandContentToTranslate } = siteToTranslate.brand;
      
      const payload: Omit<SiteData, 'brand'|'products'> & { 
        brand: Omit<SiteData['brand'], 'heroImage'>,
        products: Omit<Product, 'badge'>[] // badges are translated separately
      } = { 
          ...siteToTranslate, 
          brand: brandContentToTranslate,
          products: siteToTranslate.products.map(({badge, ...rest}) => rest)
      };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(payload),
        targetLanguage: targetLanguage.code,
      });
      
      const translatedData = JSON.parse(translatedJson || '{}') as Partial<SiteData>;

      // Re-assemble the final, translated site data
      const finalTranslatedSite: SiteData = {
          ...siteToTranslate, // Base structure with user data
          brand: {
              ...(translatedData.brand || siteToTranslate.brand),
              heroImage: siteToTranslate.brand.heroImage, // Crucially, restore the user's hero image
          },
          services: translatedData.services || siteToTranslate.services,
          products: translatedData.products ? siteToTranslate.products.map((p, i) => ({...p, ...translatedData.products![i]})) : siteToTranslate.products,
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

  if (!isMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
