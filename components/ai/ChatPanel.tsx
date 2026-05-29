'use client';

import {useEffect, useRef, useState} from 'react';
import {ChatHeader} from './ChatHeader';
import {ChatInput} from './ChatInput';
import {MessageList} from './MessageList';
import {useChat} from '@/hooks/useChat';

export function ChatPanel({
  locale,
  onClose,
  pendingMessage,
  onPendingConsumed,
}: {
  locale: string;
  onClose: () => void;
  pendingMessage?: string | null;
  onPendingConsumed?: () => void;
}) {
  const chat = useChat(locale);
  const [focusSignal, setFocusSignal] = useState(0);
  const hasSentPending = useRef(false);

  useEffect(() => {
    if (pendingMessage && !hasSentPending.current) {
      hasSentPending.current = true;
      const timer = setTimeout(() => {
        chat.sendMessage(pendingMessage);
        onPendingConsumed?.();
      }, 350);
      return () => clearTimeout(timer);
    }
  // Only run on mount — pendingMessage is captured at open time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-bg-elevated md:inset-auto md:bottom-[84px] md:right-8 md:h-[640px] md:w-[480px] md:border md:border-border md:shadow-[0_8px_48px_rgba(26,26,46,0.18)]">
      <ChatHeader leadCode={chat.leadCode} onClose={onClose} />
      <MessageList
        messages={chat.messages}
        isLoading={chat.isLoading}
        showWhatsAppCta={chat.showWhatsAppCta}
        leadCode={chat.leadCode}
        whatsAppLink={chat.whatsAppLink}
        onQuickAction={chat.sendMessage}
        onAskQuestion={() => setFocusSignal((c) => c + 1)}
      />
      {chat.error && (
        <p className="border-t border-border px-5 py-2 text-xs text-red-500">{chat.error}</p>
      )}
      <ChatInput onSend={chat.sendMessage} onSendImage={chat.sendImage} disabled={chat.isLoading} focusSignal={focusSignal} locale={locale} />
    </div>
  );
}
