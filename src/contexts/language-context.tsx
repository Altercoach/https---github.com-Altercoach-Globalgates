
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData, Language } from '@/lib/types';
import { LANGUAGES, LS_KEYS } from '@/lib/constants';
import { translateSiteContent } from '@/ai/flows/translate-site-content';
import { useToast } from '@/hooks/use-toast';
import { useSite } from '@/hooks/use-site';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translatedSite: SiteData;
  isTranslating: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { site: userSite, isMounted: isSiteMounted } = useSite();
  const { toast } = useToast();
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);
  const [translatedSite, setTranslatedSite] = useState<SiteData>(userSite);
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
      // If the target language is Spanish (our source for user content),
      // we just use the user's site data directly.
      if (targetLanguage.code === 'es') {
        setTranslatedSite(siteContent);
        return;
      }
      
      // Prepare only the translatable text fields.
      const translatablePayload = {
        brand: {
          name: siteContent.brand.name,
          tagline: siteContent.brand.tagline,
          heroTitle: siteContent.brand.heroTitle,
          heroSubtitle: siteContent.brand.heroSubtitle,
        },
        services: siteContent.services.map(({ id, title, bullets }) => ({ id, title, bullets })),
        products: siteContent.products.map(({ id, name, note, description, badge }) => ({ id, name, note, description, badge: badge.es })),
      };

      const translatedJson = await translateSiteContent({
        siteContent: JSON.stringify(translatablePayload),
        targetLanguage: targetLanguage.code,
      });

      const translatedData = JSON.parse(translatedJson || '{}');
      
      // Reconstruct the full SiteData object, merging non-translatable data
      // with the newly translated text.
      const finalContent: SiteData = {
        ...siteContent, // Start with the original to preserve images, colors, prices, etc.
        brand: {
          ...siteContent.brand, // Preserve heroImage, colors
          ...translatedData.brand, // Overwrite with translated text
        },
        services: siteContent.services.map(s => {
          const translatedSvc = translatedData.services?.find((ts: any) => ts.id === s.id);
          return translatedSvc ? { ...s, ...translatedSvc } : s; // Preserve original service structure
        }),
        products: siteContent.products.map(p => {
          const translatedProd = translatedData.products?.find((tp: any) => tp.id === p.id);
          if (translatedProd) {
            // Reconstruct the multilingual badge
            const newBadge = { ...p.badge, [targetLanguage.code]: translatedProd.badge };
            return { ...p, ...translatedProd, badge: newBadge }; // Preserve price, type, interval, etc.
          }
          return p;
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
      translate(userSite, language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, userSite, isMounted, isSiteMounted]);

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
