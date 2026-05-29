'use client';

import {useEffect, useState} from 'react';
import {Bot} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useAIChat} from '@/contexts/AIChatContext';

export function ChatWidget() {
  const {isOpen, open} = useAIChat();
  const t = useTranslations('nav');
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;
    function check() {
      setPastHero(window.scrollY > threshold);
    }
    check();
    window.addEventListener('scroll', check, {passive: true});
    return () => window.removeEventListener('scroll', check);
  }, []);

  if (isOpen) return null;

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.button
          type="button"
          onClick={() => open()}
          initial={{opacity: 0, y: 12, scale: 0.92}}
          animate={{opacity: 1, y: 0, scale: 1}}
          exit={{opacity: 0, y: 12, scale: 0.92}}
          transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
          className="fixed bottom-24 end-6 z-[200] inline-flex items-center gap-2 rounded-full bg-bg-dark px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(26,26,46,0.4)] ring-1 ring-white/10 transition-all hover:scale-105 hover:ring-accent/40 md:bottom-28 md:end-8"
        >
          <Bot className="h-4 w-4 text-accent" aria-hidden />
          <span>{t('aiAssistant')}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
