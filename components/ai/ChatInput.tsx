'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUp, ImagePlus, Mic, MicOff} from 'lucide-react';
import {useTranslations} from 'next-intl';

const speechLangMap: Record<string, string> = {
  en: 'en-US',
  az: 'az-AZ',
  ru: 'ru-RU',
  tr: 'tr-TR',
  ar: 'ar-SA',
};

export function ChatInput({
  onSend,
  onSendImage,
  disabled,
  focusSignal,
  locale = 'en',
}: {
  onSend: (text: string) => void;
  onSendImage?: (file: File) => void;
  disabled: boolean;
  focusSignal: number;
  locale?: string;
}) {
  const t = useTranslations('ai');
  const [value, setValue] = useState('');
  const [showConsent, setShowConsent] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const canSend = value.trim().length > 0 && !disabled;

  useEffect(() => {
    setVoiceSupported(
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [focusSignal]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  function resize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '28px';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function submit() {
    if (!canSend) return;
    // Stop any active recording before sending
    if (isListening) stopListening();
    onSend(value);
    setValue('');
    setShowConsent(false);
    window.requestAnimationFrame(resize);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onSendImage) return;
    onSendImage(file);
    setShowConsent(false);
    e.target.value = '';
  }

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }

  function toggleVoice() {
    if (isListening) {
      stopListening();
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = speechLangMap[locale] ?? 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as ArrayLike<SpeechRecognitionResult>)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript as string)
        .join('');
      setValue(transcript);
      // Resize textarea to fit new content
      window.requestAnimationFrame(resize);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      // Focus textarea so user can edit or send
      textareaRef.current?.focus();
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  return (
    <div className="shrink-0 bg-bg-elevated px-4 pb-4 pt-3">
      <div className={`flex items-end gap-2 rounded-2xl border bg-bg-primary px-4 py-3 transition-colors focus-within:border-fg-tertiary/40 ${
        isListening ? 'border-accent/50 shadow-[0_0_0_3px_rgba(0,113,227,0.10)]' : 'border-border'
      }`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={isListening ? '🎙️ Listening…' : t('placeholder')}
          className="max-h-[120px] flex-1 resize-none bg-transparent py-0.5 text-sm leading-relaxed text-fg-primary placeholder:text-fg-tertiary outline-none"
          style={{height: '28px', minHeight: '28px'}}
          rows={1}
        />
        <div className="flex shrink-0 items-center gap-1">
          {onSendImage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                title={t('imageUpload')}
                className="flex h-7 w-7 items-center justify-center text-fg-tertiary transition-colors hover:text-fg-primary disabled:opacity-30"
              >
                <ImagePlus className="h-3.5 w-3.5" aria-hidden />
              </button>
            </>
          )}

          {/* Voice button — active when voiceSupported */}
          {voiceSupported ? (
            <button
              type="button"
              onClick={toggleVoice}
              disabled={disabled}
              title={isListening ? 'Stop recording' : 'Voice message'}
              aria-label={isListening ? 'Stop recording' : 'Start voice input'}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all disabled:opacity-30 ${
                isListening
                  ? 'bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.20)]'
                  : 'text-fg-tertiary hover:text-fg-primary'
              }`}
            >
              {isListening ? (
                <>
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
                  <MicOff className="relative h-3.5 w-3.5" aria-hidden />
                </>
              ) : (
                <Mic className="h-3.5 w-3.5" aria-hidden />
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              title={t('voiceInput')}
              className="flex h-7 w-7 items-center justify-center text-fg-tertiary opacity-20"
            >
              <Mic className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}

          <button
            type="button"
            disabled={!canSend}
            onClick={submit}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-fg-primary text-white transition-opacity disabled:opacity-20"
            aria-label={t('send')}
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
      {showConsent && (
        <p className="mt-2 text-center text-[10px] text-fg-tertiary">
          {t('consent')}
        </p>
      )}
    </div>
  );
}
