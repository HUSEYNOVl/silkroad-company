'use client';

import {useState} from 'react';
import {useMessages, useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircle2} from 'lucide-react';
import {quoteSchema, type QuoteFormValues} from '@/lib/validators';

type Option = {value: string; label: string};
type QuoteMessages = {
  quote: {
    categories: Option[];
    countries: Option[];
    shipping: Option[];
    sources: Option[];
  };
};

export function QuoteForm() {
  const t = useTranslations('quote');
  const messages = useMessages() as unknown as QuoteMessages;
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '';
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors, isSubmitting}
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      category: 'electronics',
      destinationCountry: 'azerbaijan',
      shippingPreference: 'not-sure',
      oemRequired: false,
      customPackaging: false,
      sampleNeeded: false,
      files: [],
      website: ''
    }
  });

  async function onSubmit(values: QuoteFormValues) {
    setError(null);
    try {
      const response = await fetch('/api/quote', {
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

  if (success) {
    return (
      <div className="border border-border bg-bg-secondary p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
        <h2 className="mt-6 font-display text-3xl text-fg-primary">{t('successTitle')}</h2>
        <p className="mt-3 text-fg-secondary">{t('successText')}</p>
        <a href={`https://wa.me/${phone}`} className="mt-8 inline-flex h-11 items-center bg-accent px-6 text-sm font-semibold text-bg-dark">{t('whatsapp')}</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-border bg-bg-primary p-6 md:p-10" noValidate>
      <div className="mb-8">
        <p className="font-mono text-xs uppercase text-fg-tertiary">{t('stepLabel', {step})}</p>
        <div className="mt-3 h-1 bg-bg-secondary">
          <div className="h-full bg-accent transition-all" style={{width: `${(step / 3) * 100}%`}} />
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-5">
          <Field label={t('productName')} error={errors.productName?.message}><input className="field" {...register('productName')} /></Field>
          <Field label={t('category')} error={errors.category?.message}><select className="field" {...register('category')}>{messages.quote.categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
          <Field label={t('quantity')} error={errors.quantity?.message}><input className="field" {...register('quantity')} /></Field>
          <Field label={t('targetPrice')} error={errors.targetPrice?.message}><input className="field" {...register('targetPrice')} /></Field>
          <Field label={t('referenceUrl')} error={errors.referenceUrl?.message}><input className="field" {...register('referenceUrl')} /></Field>
          <Field label={t('files')}><input type="file" multiple className="field" onChange={(event) => setValue('files', Array.from(event.target.files ?? []).slice(0, 5).map((file) => file.name))} /></Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5">
          <Field label={t('destinationCountry')} error={errors.destinationCountry?.message}><select className="field" {...register('destinationCountry')}>{messages.quote.countries.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
          <Toggle label={t('oemRequired')} checked={watch('oemRequired')} onChange={(value) => setValue('oemRequired', value)} />
          <Toggle label={t('customPackaging')} checked={watch('customPackaging')} onChange={(value) => setValue('customPackaging', value)} />
          <Field label={t('shippingPreference')} error={errors.shippingPreference?.message}><select className="field" {...register('shippingPreference')}>{messages.quote.shipping.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
          <Toggle label={t('sampleNeeded')} checked={watch('sampleNeeded')} onChange={(value) => setValue('sampleNeeded', value)} />
          <Field label={t('notes')} error={errors.notes?.message}><textarea className="field min-h-32" {...register('notes')} /></Field>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-5">
          <Field label={t('name')} error={errors.name?.message}><input className="field" {...register('name')} /></Field>
          <Field label={t('company')} error={errors.company?.message}><input className="field" {...register('company')} /></Field>
          <Field label={t('email')} error={errors.email?.message}><input className="field" type="email" {...register('email')} /></Field>
          <Field label={t('whatsappField')} error={errors.whatsapp?.message}><input className="field" {...register('whatsapp')} /></Field>
          <Field label={t('wechat')} error={errors.wechat?.message}><input className="field" {...register('wechat')} /></Field>
          <Field label={t('source')} error={errors.source?.message}><select className="field" {...register('source')}>{messages.quote.sources.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
          <input {...register('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="h-11 border border-border px-6 text-sm font-semibold">{t('back')}</button>}
        {step < 3 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="h-11 bg-navy px-6 text-sm font-semibold text-white">{t('next')}</button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="h-11 bg-accent px-6 text-sm font-semibold text-bg-dark disabled:opacity-50">{isSubmitting ? t('sending') : t('submit')}</button>
        )}
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </form>
  );
}

function Field({label, error, children}: {label: string; error?: string; children: React.ReactNode}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-fg-primary">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

function Toggle({label, checked, onChange}: {label: string; checked: boolean; onChange: (value: boolean) => void}) {
  return (
    <label className="flex items-center justify-between border border-border p-4 text-sm font-medium text-fg-primary">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-accent" />
    </label>
  );
}
