'use client';

import { useContext } from 'react';
import { ChatWidgetContext } from '@/contexts/chat-widget-context';

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  if (!context) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
};
