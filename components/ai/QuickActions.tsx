'use client';

import {useTranslations} from 'next-intl';

export function QuickActions({
  onSend,
  onAskQuestion,
}: {
  onSend: (text: string) => void;
  onAskQuestion: () => void;
}) {
  const t = useTranslations('ai.quickActions');

  const actions = [
    {label: t('source'), text: t('sourceText'), icon: '📦'},
    {label: t('oem'), text: t('oemText'), icon: '🏷️'},
    {label: t('verify'), text: t('verifyText'), icon: '🔍'},
    {label: t('ask'), text: null, icon: '💬'},
  ];

  return (
    <div className="pb-2 pt-6">
      <p className="mb-4 text-center text-sm font-medium text-fg-primary">{t('heading')}</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({label, text, icon}) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (text) onSend(text);
              else onAskQuestion();
            }}
            className="flex flex-col items-start gap-2 rounded-xl border border-border bg-bg-primary p-4 text-left transition-all hover:border-accent/40 hover:bg-bg-secondary"
          >
            <span className="text-xl" aria-hidden>{icon}</span>
            <span className="text-xs font-medium leading-tight text-fg-primary">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
