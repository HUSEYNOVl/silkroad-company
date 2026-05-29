'use client';

import {useTranslations} from 'next-intl';

export function WhatsAppCtaCard({
  leadCode,
  link,
}: {
  leadCode: string;
  link: string;
}) {
  const t = useTranslations('ai.whatsappCta');

  async function handleClick() {
    await fetch('/api/ai/whatsapp-click', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({lead_code: leadCode}),
    }).catch(() => undefined);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="rounded-xl border border-border bg-bg-primary p-4">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden />
        <p className="text-sm font-medium text-fg-primary">{t('ready')}</p>
      </div>
      <p className="mt-1.5 font-mono text-xs text-accent">{leadCode}</p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition-colors hover:bg-[#1da851]"
      >
        {t('button')}
      </button>
      <p className="mt-2 text-center text-[10px] text-fg-tertiary">
        {t('note')}
      </p>
    </div>
  );
}
