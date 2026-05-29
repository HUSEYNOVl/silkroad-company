import {unstable_setRequestLocale} from 'next-intl/server';
import {ProcessContent} from '@/components/sections/ProcessContent';
import type {Locale} from '@/lib/navigation';

export default function ProcessPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  return <ProcessContent />;
}
