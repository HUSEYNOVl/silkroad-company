'use client';

import {useCallback, useEffect, useState} from 'react';
import {useLeadCode} from './useLeadCode';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  content_type?: 'text' | 'image';
  imageUrl?: string;
  created_at: string;
};

type ChatMetadata = {
  lead_code: string;
  show_whatsapp_cta: boolean;
  whatsapp_link: string | null;
  whatsapp_prefill_text: string | null;
};

type StreamPayload = {
  delta?: string;
  error?: string;
  __metadata__?: ChatMetadata;
};

function getSessionId() {
  const key = 'silk-road-ai-session-id';
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

function parseStreamPayload(value: string): StreamPayload | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as StreamPayload;
    return null;
  } catch {
    return null;
  }
}

export function useChat(locale: string) {
  const {leadCode, setLeadCode} = useLeadCode();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWhatsAppCta, setShowWhatsAppCta] = useState(false);
  const [whatsAppLink, setWhatsAppLink] = useState<string | null>(null);
  const [whatsAppPrefillText, setWhatsAppPrefillText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const initSession = useCallback(() => {
    const id = getSessionId();
    setSessionId(id);
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = sessionId ?? getSessionId();
    setSessionId(id);
    setError(null);
    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: window.crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      content_type: 'text',
      created_at: new Date().toISOString()
    };
    const assistantId = window.crypto.randomUUID();
    setMessages((current) => [
      ...current,
      userMessage,
      {id: assistantId, role: 'assistant', content: '', content_type: 'text', created_at: new Date().toISOString()}
    ]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: trimmed, session_id: id, lead_code: leadCode ?? undefined, locale})
      });
      if (!response.ok || !response.body) {
        const errJson = await response.json().catch(() => ({})) as {error?: string};
        throw new Error(errJson.error ?? `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let complete = false;
      while (!complete) {
        const {value, done} = await reader.read();
        complete = done;
        buffer += decoder.decode(value, {stream: !done});
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        parts.forEach((part) => {
          const line = part.split('\n').find((item) => item.startsWith('data: '));
          if (!line) return;
          const payload = parseStreamPayload(line.slice(6));
          if (!payload) return;
          if (payload.delta) {
            setMessages((current) => current.map((message) =>
              message.id === assistantId ? {...message, content: message.content + payload.delta} : message
            ));
          }
          if (payload.error) setError(payload.error);
          if (payload.__metadata__) {
            setLeadCode(payload.__metadata__.lead_code);
            setShowWhatsAppCta(payload.__metadata__.show_whatsapp_cta);
            setWhatsAppLink(payload.__metadata__.whatsapp_link);
            setWhatsAppPrefillText(payload.__metadata__.whatsapp_prefill_text);
          }
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'The assistant is unavailable. Please try again.';
      setError(msg);
      setMessages((current) => current.map((message) =>
        message.id === assistantId && !message.content
          ? {...message, content: msg}
          : message
      ));
    } finally {
      setIsLoading(false);
    }
  }, [leadCode, locale, sessionId, setLeadCode]);

  const sendImage = useCallback(async (file: File) => {
    const id = sessionId ?? getSessionId();
    setSessionId(id);
    setError(null);
    setIsLoading(true);

    const objectUrl = URL.createObjectURL(file);
    const userMessageId = window.crypto.randomUUID();
    const assistantId = window.crypto.randomUUID();

    setMessages((current) => [
      ...current,
      {
        id: userMessageId,
        role: 'user',
        content: 'Sent an image for analysis',
        content_type: 'image',
        imageUrl: objectUrl,
        created_at: new Date().toISOString()
      },
      {id: assistantId, role: 'assistant', content: '', content_type: 'text', created_at: new Date().toISOString()}
    ]);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('session_id', id);
      if (leadCode) formData.append('lead_code', leadCode);
      formData.append('locale', locale);

      const response = await fetch('/api/ai/image', {method: 'POST', body: formData});
      if (!response.ok || !response.body) throw new Error('Image analysis failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let complete = false;
      while (!complete) {
        const {value, done} = await reader.read();
        complete = done;
        buffer += decoder.decode(value, {stream: !done});
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        parts.forEach((part) => {
          const line = part.split('\n').find((item) => item.startsWith('data: '));
          if (!line) return;
          const payload = parseStreamPayload(line.slice(6));
          if (!payload) return;
          if (payload.delta) {
            setMessages((current) => current.map((message) =>
              message.id === assistantId ? {...message, content: message.content + payload.delta} : message
            ));
          }
          if (payload.error) setError(payload.error);
          if (payload.__metadata__) {
            if (payload.__metadata__.lead_code) setLeadCode(payload.__metadata__.lead_code);
            setShowWhatsAppCta(payload.__metadata__.show_whatsapp_cta);
            setWhatsAppLink(payload.__metadata__.whatsapp_link);
          }
        });
      }
    } catch {
      setError('Image analysis failed. Please try again.');
      setMessages((current) => current.map((message) =>
        message.id === assistantId && !message.content
          ? {...message, content: 'Image analysis failed. Please describe the product in text instead.'}
          : message
      ));
    } finally {
      setIsLoading(false);
    }
  }, [leadCode, locale, sessionId, setLeadCode]);

  return {
    messages,
    leadCode,
    isLoading,
    showWhatsAppCta,
    whatsAppLink,
    whatsAppPrefillText,
    error,
    sendMessage,
    sendImage,
    initSession
  };
}
