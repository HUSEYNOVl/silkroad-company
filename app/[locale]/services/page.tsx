import {unstable_setRequestLocale} from 'next-intl/server';
import {ServicesContent} from '@/components/sections/ServicesContent';
import type {Locale} from '@/lib/navigation';

export default function ServicesPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  return <ServicesContent />;
}
