'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Check, ChevronDown, Globe} from 'lucide-react';
import {AnimatePresence, motion} from 'framer-motion';
import {localeLabels, locales, type Locale, usePathname, useRouter} from '@/lib/navigation';
import {cn} from '@/lib/utils';

const flags: Record<Locale, string> = {
  en: '🇬🇧',
  az: '🇦🇿',
  ru: '🇷🇺',
  tr: '🇹🇷',
  ar: '🇦🇪',
};

const shortCodes: Record<Locale, string> = {
  en: 'EN',
  az: 'AZ',
  ru: 'RU',
  tr: 'TR',
  ar: 'AR',
};

export function LanguageSwitcher({dark = false}: {dark?: boolean}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const router = useRouter() as {replace: (href: string, options: {locale: Locale}) => void};
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function select(next: Locale) {
    router.replace(pathname, {locale: next});
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">

      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language')}
        className={cn(
          'group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
          dark
            ? open
              ? 'border border-white/25 bg-white/12 text-white shadow-[0_0_0_3px_rgba(255,255,255,0.05)]'
              : 'border border-white/12 text-white/60 hover:border-white/25 hover:bg-white/8 hover:text-white'
            : open
              ? 'border border-accent/35 bg-accent/8 text-accent shadow-[0_0_0_3px_rgba(184,137,42,0.08)]'
              : 'border border-border text-fg-secondary hover:border-accent/25 hover:bg-accent/5 hover:text-fg-primary'
        )}
      >
        <Globe
          className={cn(
            'h-3.5 w-3.5 transition-colors',
            dark ? 'text-white/50 group-hover:text-white/80' : 'text-fg-tertiary group-hover:text-accent'
          )}
          aria-hidden
        />
        <span className={cn('font-mono text-[11px] font-bold tracking-[0.12em]', dark ? '' : '')}>
          {shortCodes[locale]}
        </span>
        <span className="hidden sm:block text-sm font-medium">{localeLabels[locale]}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200 ease-out',
            open && 'rotate-180',
            dark ? 'text-white/40' : 'text-fg-tertiary'
          )}
          aria-hidden
        />
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={t('language')}
            initial={{opacity: 0, scale: 0.96, y: -4}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.96, y: -4}}
            transition={{duration: 0.18, ease: [0.22, 1, 0.36, 1]}}
            className="absolute end-0 top-[calc(100%+8px)] z-[300] w-56 overflow-hidden rounded-2xl border border-border bg-bg-primary/98 shadow-[0_20px_60px_rgba(26,26,46,0.18),0_4px_16px_rgba(26,26,46,0.08)] backdrop-blur-xl"
          >
            {/* Panel header */}
            <div className="border-b border-border px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-tertiary">
                {t('language')}
              </p>
            </div>

            {/* Options */}
            <div className="p-1.5">
              {locales.map((item) => {
                const isSelected = item === locale;
                return (
                  <button
                    key={item}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => select(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150',
                      isSelected
                        ? 'bg-accent/8 text-accent'
                        : 'text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary'
                    )}
                  >
                    {/* Flag */}
                    <span className="text-base leading-none">{flags[item]}</span>

                    {/* Short code */}
                    <span
                      className={cn(
                        'font-mono text-[10px] font-bold uppercase tracking-wider',
                        isSelected ? 'text-accent/60' : 'text-fg-tertiary'
                      )}
                    >
                      {shortCodes[item]}
                    </span>

                    {/* Full name */}
                    <span className="flex-1 text-start font-medium">{localeLabels[item]}</span>

                    {/* Active check */}
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                    ) : (
                      <span className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
