'use client';

import {useEffect, useRef} from 'react';
import type {ChatMessage} from '@/hooks/useChat';
import {MessageBubble} from './MessageBubble';
import {QuickActions} from './QuickActions';
import {TypingIndicator} from './TypingIndicator';
import {WhatsAppCtaCard} from './WhatsAppCtaCard';

export function MessageList({
  messages,
  isLoading,
  showWhatsAppCta,
  leadCode,
  whatsAppLink,
  onQuickAction,
  onAskQuestion
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  showWhatsAppCta: boolean;
  leadCode: string | null;
  whatsAppLink: string | null;
  onQuickAction: (text: string) => void;
  onAskQuestion: () => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({block: 'end'});
  }, [messages, isLoading, showWhatsAppCta]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5">
      <div className="grid gap-5">
        {messages.length === 0 && <QuickActions onSend={onQuickAction} onAskQuestion={onAskQuestion} />}
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        {isLoading && <TypingIndicator />}
        {showWhatsAppCta && leadCode && whatsAppLink && <WhatsAppCtaCard leadCode={leadCode} link={whatsAppLink} />}
        <div ref={endRef} />
      </div>
    </div>
  );
}
