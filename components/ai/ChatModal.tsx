'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChatHeader} from './ChatHeader';
import {ChatInput} from './ChatInput';
import {MessageList} from './MessageList';
import {useChat} from '@/hooks/useChat';
import {useAIChat} from '@/contexts/AIChatContext';

export function ChatModal({locale}: {locale: string}) {
  const {isOpen, close, pendingMessage, clearPending} = useAIChat();
  const chat = useChat(locale);
  const [focusSignal, setFocusSignal] = useState(0);
  const hasSentPending = useRef(false);

  useEffect(() => {
    if (isOpen && pendingMessage && !hasSentPending.current) {
      hasSentPending.current = true;
      const timer = setTimeout(() => {
        void chat.sendMessage(pendingMessage);
        clearPending();
      }, 300);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) hasSentPending.current = false;
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="chat-backdrop"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/*
            Container handles positioning.
            Mobile: full screen flex-col
            Desktop: centered via flex items-center justify-center
            Framer Motion only animates scale/opacity on the inner panel — no transform conflict.
          */}
          <div className="fixed inset-0 z-[301] flex flex-col md:items-center md:justify-center md:p-6">
            <motion.div
              key="chat-panel"
              initial={{opacity: 0, scale: 0.96, y: 16}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.96, y: 16}}
              transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
              className="flex flex-1 flex-col overflow-hidden bg-bg-elevated md:flex-none md:h-[85vh] md:max-h-[760px] md:w-full md:max-w-[720px] md:rounded-2xl md:border md:border-border md:shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
            >
              <ChatHeader leadCode={chat.leadCode} onClose={close} />
              <MessageList
                messages={chat.messages}
                isLoading={chat.isLoading}
                showWhatsAppCta={chat.showWhatsAppCta}
                leadCode={chat.leadCode}
                whatsAppLink={chat.whatsAppLink}
                onQuickAction={(text) => void chat.sendMessage(text)}
                onAskQuestion={() => setFocusSignal((c) => c + 1)}
              />
              {chat.error && (
                <p className="border-t border-border px-5 py-2 text-xs text-red-500">{chat.error}</p>
              )}
              <ChatInput
                onSend={(text) => void chat.sendMessage(text)}
                onSendImage={(file) => void chat.sendImage(file)}
                disabled={chat.isLoading}
                focusSignal={focusSignal}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
