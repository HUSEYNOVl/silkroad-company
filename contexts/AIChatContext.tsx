'use client';

import {createContext, useCallback, useContext, useState} from 'react';

type AIChatContextType = {
  isOpen: boolean;
  open: (message?: string) => void;
  close: () => void;
  pendingMessage: string | null;
  clearPending: () => void;
};

const AIChatContext = createContext<AIChatContextType | null>(null);

export function AIChatProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const open = useCallback((message?: string) => {
    if (message) setPendingMessage(message);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearPending = useCallback(() => {
    setPendingMessage(null);
  }, []);

  return (
    <AIChatContext.Provider value={{isOpen, open, close, pendingMessage, clearPending}}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error('useAIChat must be used within AIChatProvider');
  return ctx;
}
