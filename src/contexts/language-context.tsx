
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
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { isMounted: isSiteMounted } = useSite();
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);
  const [isMounted, setIsMounted] = useState(false);

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
                return item[langCode];
            }
            return ''; // Should not happen with correct types
        }) as any;
    }

    if (typeof content === 'object' && content !== null && langCode in content) {
        return content[langCode] as any;
    }

    // Fallback for safety
    return '' as any;
  }, [language.code]);


  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    getTranslation,
    isTranslating: false, // No more AI translation
  }), [language, getTranslation]);

  if (!isMounted || !isSiteMounted) {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
