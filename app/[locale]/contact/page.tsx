import {unstable_setRequestLocale} from 'next-intl/server';
import {ContactContent} from '@/components/sections/ContactContent';
import type {Locale} from '@/lib/navigation';

export default function ContactPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  return <ContactContent />;
}
