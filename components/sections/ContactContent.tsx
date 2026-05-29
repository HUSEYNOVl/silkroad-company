'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircle2, MessageSquare, Mail, MapPin} from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import {Button} from '@/components/ui/Button';
import {Eyebrow} from '@/components/ui/Section';
import {contactSchema, type ContactFormValues} from '@/lib/validators';

export function ContactContent() {
  const t = useTranslations('contact');
  const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? '';
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {budget: '', company: ''}
  });

  async function onSubmit(values: ContactFormValues) {
    setError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error('failed');
      setSuccess(true);
    } catch {
      setError(t('error'));
    }
  }

  return (
    <section className="container-grid grid min-h-screen gap-12 pb-24 pt-32 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20 lg:pb-40">
      {/* Left: form */}
      <div>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mt-5 font-display text-display-m font-medium text-fg-primary">{t('title')}</h1>
        <p className="mt-4 max-w-md text-body-l leading-relaxed text-fg-secondary">{t('text')}</p>

        <div className="mt-12">
          {success ? (
            <div className="border border-border-strong bg-bg-secondary p-10">
              <CheckCircle2 className="h-10 w-10 text-accent" />
              <h2 className="mt-6 font-display text-h1 font-semibold text-fg-primary">{t('successTitle')}</h2>
              <p className="mt-3 text-body text-fg-secondary">{t('successText')}</p>
              <a
                href={`https://wa.me/${WA}`}
                className="mt-8 inline-flex h-11 items-center border border-accent px-6 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-bg-primary"
              >
                {t('continueWhatsapp')}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={t('name')} error={errors.name?.message}>
                  <input {...register('name')} className="field" autoComplete="name" />
                </Field>
                <Field label={t('contact')} error={errors.contact?.message}>
                  <input
                    {...register('contact')}
                    className="field"
                    placeholder={t('placeholderContact')}
                  />
                </Field>
              </div>
              <Field label={t('need')} error={errors.need?.message}>
                <textarea
                  {...register('need')}
                  className="field min-h-36 resize-y"
                  rows={5}
                  placeholder={t('placeholderNeed')}
                />
              </Field>
              <Field label={`${t('budget')} (${t('optional')})`} error={errors.budget?.message}>
                <select {...register('budget')} className="field cursor-pointer">
                  <option value="" className="bg-bg-primary">—</option>
                  <option value="<$1k"    className="bg-bg-primary">&lt;$1k</option>
                  <option value="$1k-10k" className="bg-bg-primary">$1k – $10k</option>
                  <option value="$10k-50k" className="bg-bg-primary">$10k – $50k</option>
                  <option value="$50k+"   className="bg-bg-primary">$50k+</option>
                </select>
              </Field>
              {/* Honeypot */}
              <input {...register('company')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <Button type="submit" disabled={isSubmitting} className="mt-2 w-full sm:w-auto sm:px-10">
                {isSubmitting ? t('sending') : t('submit')}
              </Button>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            </form>
          )}
        </div>
      </div>

      {/* Right: direct contact card */}
      <aside className="self-start lg:sticky lg:top-28">
        <div className="border border-border-strong bg-bg-secondary p-8">
          <h2 className="font-display text-h2 font-semibold text-fg-primary">{t('direct')}</h2>
          <p className="mt-2 text-sm text-fg-secondary">{t('scanPrompt')}</p>
          <div className="mt-8 inline-flex bg-fg-primary p-3">
            <QRCodeSVG value={`https://wa.me/${WA}`} size={160} />
          </div>
          <div className="mt-8 grid gap-5">
            <a
              href={`https://wa.me/${WA}`}
              className="flex items-center gap-3 text-sm text-fg-secondary transition-colors hover:text-accent"
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-accent" />
              {t('whatsappLabel')}
            </a>
            <a
              href="mailto:hello@sarkhan.com"
              className="flex items-center gap-3 text-sm text-fg-secondary transition-colors hover:text-accent"
            >
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              hello@sarkhan.com
            </a>
            <p className="flex items-center gap-3 text-sm text-fg-secondary">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              Baku, Azerbaijan
            </p>
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm font-semibold text-fg-primary">{t('response')}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-fg-primary">{label}</span>
      {children}
      {error ? <span className="text-xs text-accent">{error}</span> : null}
    </label>
  );
}
