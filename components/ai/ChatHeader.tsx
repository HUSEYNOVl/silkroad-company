'use client';

import {Bot, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {LeadCodeBadge} from './LeadCodeBadge';

export function ChatHeader({
  leadCode,
  onClose,
}: {
  leadCode: string | null;
  onClose: () => void;
}) {
  const t = useTranslations('ai');

  return (
    <div className="flex items-center justify-between border-b border-border bg-bg-elevated px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-subtle">
          <Bot className="h-4 w-4 text-accent" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-fg-primary">{t('title')}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden />
            <p className="text-xs text-fg-tertiary">{t('status')}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {leadCode && <LeadCodeBadge leadCode={leadCode} />}
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-fg-tertiary transition-colors hover:bg-bg-secondary hover:text-fg-primary"
          aria-label={t('close')}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
