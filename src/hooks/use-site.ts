import { useContext } from 'react';
import { SiteContext } from '@/contexts/site-context';

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
