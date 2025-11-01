'use client';

import React, { createContext, useState, useMemo } from 'react';

interface ChatWidgetContextType {
  isWidgetOpen: boolean;
  setIsWidgetOpen: (isOpen: boolean) => void;
  initialMessage: string | null;
  setInitialMessage: (message: string | null) => void;
  openChatWidget: (message?: string) => void;
  clearInitialMessage: () => void;
}

export const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

export function ChatWidgetProvider({ children }: { children: React.ReactNode }) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  const openChatWidget = (message?: string) => {
    if (message) {
      setInitialMessage(message);
    }
    setIsWidgetOpen(true);
  };
  
  const clearInitialMessage = () => {
    setInitialMessage(null);
  };

  const value = useMemo(() => ({
    isWidgetOpen,
    setIsWidgetOpen,
    initialMessage,
    setInitialMessage,
    openChatWidget,
    clearInitialMessage,
  }), [isWidgetOpen, initialMessage]);

  return (
    <ChatWidgetContext.Provider value={value}>
      {children}
    </ChatWidgetContext.Provider>
  );
}
