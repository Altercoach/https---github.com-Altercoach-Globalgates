'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FEATURE_FLAGS } from '../lib/feature-flags';

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS | string;

interface FeatureFlagContextProps {
  enabledFlags: Record<string, boolean>;
  isFeatureEnabled: (flag: FeatureFlagKey) => boolean;
  setFeatureFlag: (flag: FeatureFlagKey, enabled: boolean) => void;
  toggleFeatureFlag: (flag: FeatureFlagKey) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextProps | undefined>(undefined);

export const FeatureFlagProvider = ({ children, initialFlags }: { children: ReactNode; initialFlags?: Record<string, boolean> }) => {
  const [enabledFlags, setEnabledFlags] = useState<Record<string, boolean>>(initialFlags || {});

  const isFeatureEnabled = (flag: FeatureFlagKey) => {
    return !!enabledFlags[flag];
  };

  const setFeatureFlag = (flag: FeatureFlagKey, enabled: boolean) => {
    setEnabledFlags((prev) => ({ ...prev, [flag]: enabled }));
  };

  const toggleFeatureFlag = (flag: FeatureFlagKey) => {
    setEnabledFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <FeatureFlagContext.Provider value={{ enabledFlags, isFeatureEnabled, setFeatureFlag, toggleFeatureFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
