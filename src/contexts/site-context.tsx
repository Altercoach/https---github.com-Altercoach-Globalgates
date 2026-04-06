
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SiteData } from '@/lib/types';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';

const SITE_STORAGE_KEY = 'goldek_key_site_v1';
const LEGACY_SITE_STORAGE_KEY = 'globalgates_site_content_v1';

interface SiteContextType {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
  isMounted: boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from the imported object. This allows for hot-reloading of content.
  const [site, setSite] = useState<SiteData>(DEFAULT_SITE_CONTENT);
  const [isMounted, setIsMounted] = useState(false);
  // The concept of "unsaved changes" is removed as we move back to a real-time update model.
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Migrate from legacy key if new key absent
        const legacy = window.localStorage.getItem(LEGACY_SITE_STORAGE_KEY);
        if (legacy && !window.localStorage.getItem(SITE_STORAGE_KEY)) {
          window.localStorage.setItem(SITE_STORAGE_KEY, legacy);
          window.localStorage.removeItem(LEGACY_SITE_STORAGE_KEY);
        }
        const stored = window.localStorage.getItem(SITE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as SiteData;
          if (parsed && typeof parsed === 'object') {
            const defaultApiKeys = {
              whatsapp: DEFAULT_SITE_CONTENT.agentConfig?.apiKeys.whatsapp ?? '',
              instagram: DEFAULT_SITE_CONTENT.agentConfig?.apiKeys.instagram ?? '',
              messenger: DEFAULT_SITE_CONTENT.agentConfig?.apiKeys.messenger ?? '',
              linkedin: DEFAULT_SITE_CONTENT.agentConfig?.apiKeys.linkedin ?? '',
              twitter: DEFAULT_SITE_CONTENT.agentConfig?.apiKeys.twitter ?? '',
            };

            const defaultSocialLinks = {
              facebook: DEFAULT_SITE_CONTENT.socialLinks?.facebook ?? '',
              instagram: DEFAULT_SITE_CONTENT.socialLinks?.instagram ?? '',
              x: DEFAULT_SITE_CONTENT.socialLinks?.x ?? '',
              linkedin: DEFAULT_SITE_CONTENT.socialLinks?.linkedin ?? '',
              youtube: DEFAULT_SITE_CONTENT.socialLinks?.youtube ?? '',
              tiktok: DEFAULT_SITE_CONTENT.socialLinks?.tiktok ?? '',
              whatsapp: DEFAULT_SITE_CONTENT.socialLinks?.whatsapp ?? '',
              threads: DEFAULT_SITE_CONTENT.socialLinks?.threads ?? '',
            };

            setSite({
              ...DEFAULT_SITE_CONTENT,
              ...parsed,
              brand: {
                ...DEFAULT_SITE_CONTENT.brand,
                ...(parsed.brand ?? {}),
              },
              agentPersona: {
                ...DEFAULT_SITE_CONTENT.agentPersona,
                ...(parsed.agentPersona ?? {}),
              },
              agentConfig: {
                isActive: parsed.agentConfig?.isActive ?? DEFAULT_SITE_CONTENT.agentConfig?.isActive ?? true,
                gender: parsed.agentConfig?.gender ?? DEFAULT_SITE_CONTENT.agentConfig?.gender ?? 'female',
                systemPrompt: parsed.agentConfig?.systemPrompt ?? DEFAULT_SITE_CONTENT.agentConfig?.systemPrompt ?? '',
                knowledgeBase: parsed.agentConfig?.knowledgeBase ?? DEFAULT_SITE_CONTENT.agentConfig?.knowledgeBase ?? '',
                supportEmail: parsed.agentConfig?.supportEmail ?? DEFAULT_SITE_CONTENT.agentConfig?.supportEmail ?? '',
                exclusionList: parsed.agentConfig?.exclusionList ?? DEFAULT_SITE_CONTENT.agentConfig?.exclusionList ?? '',
                sharePath: parsed.agentConfig?.sharePath ?? DEFAULT_SITE_CONTENT.agentConfig?.sharePath ?? '/chat',
                apiKeys: {
                  ...defaultApiKeys,
                  whatsapp: parsed.agentConfig?.apiKeys?.whatsapp ?? defaultApiKeys.whatsapp,
                  instagram: parsed.agentConfig?.apiKeys?.instagram ?? defaultApiKeys.instagram,
                  messenger: parsed.agentConfig?.apiKeys?.messenger ?? defaultApiKeys.messenger,
                  linkedin: parsed.agentConfig?.apiKeys?.linkedin ?? defaultApiKeys.linkedin,
                  twitter: parsed.agentConfig?.apiKeys?.twitter ?? defaultApiKeys.twitter,
                },
              },
              socialLinks: {
                ...defaultSocialLinks,
                facebook: parsed.socialLinks?.facebook ?? defaultSocialLinks.facebook,
                instagram: parsed.socialLinks?.instagram ?? defaultSocialLinks.instagram,
                x: parsed.socialLinks?.x ?? defaultSocialLinks.x,
                linkedin: parsed.socialLinks?.linkedin ?? defaultSocialLinks.linkedin,
                youtube: parsed.socialLinks?.youtube ?? defaultSocialLinks.youtube,
                tiktok: parsed.socialLinks?.tiktok ?? defaultSocialLinks.tiktok,
                whatsapp: parsed.socialLinks?.whatsapp ?? defaultSocialLinks.whatsapp,
                threads: parsed.socialLinks?.threads ?? defaultSocialLinks.threads,
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to load site content from localStorage', error);
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(site));
    } catch (error) {
      console.error('Failed to persist site content to localStorage', error);
    }
  }, [site, isMounted]);

  const handleSetSite = useCallback((updater: React.SetStateAction<SiteData>) => {
    // We set a flag for unsaved changes whenever the site data is modified.
    setHasUnsavedChanges(true);
    setSite(updater);
  }, []);

  const value = useMemo(() => ({ 
    site, 
    setSite: handleSetSite, 
    isMounted,
    hasUnsavedChanges,
    setHasUnsavedChanges // Still provide this for now to avoid breaking components that use it
  }), [site, isMounted, hasUnsavedChanges, handleSetSite]);

  if (!isMounted) {
    return null; 
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
}
