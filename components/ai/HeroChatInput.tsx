'use client';

import {useRef, useState} from 'react';
import {ArrowUp} from 'lucide-react';
import {useAIChat} from '@/contexts/AIChatContext';

const suggestions = [
  'Source electronics from China',
  'OEM with my own logo',
  'Verify a Chinese supplier',
  'Ship goods to Azerbaijan',
];

export function HeroChatInput() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {open} = useAIChat();

  function resize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '28px';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function submit(text = value) {
    const msg = text.trim();
    if (!msg) return;
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = '28px';
    open(msg);
  }

  return (
    <div className="mt-10 w-full max-w-2xl">
      <div className="flex items-end gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md transition-all duration-200 focus-within:border-white/50 focus-within:bg-white/15">
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
          placeholder="Tell us what product you need from China..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-white placeholder:text-white/50 outline-none"
          style={{height: '28px', minHeight: '28px', maxHeight: '120px'}}
        />
        <button
          type="button"
          onClick={() => submit()}
          disabled={!value.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-bg-dark transition-opacity disabled:opacity-40"
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => submit(s)}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/75 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/20 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
