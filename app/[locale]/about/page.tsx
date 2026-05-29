import {unstable_setRequestLocale} from 'next-intl/server';
import {AboutContent} from '@/components/sections/AboutContent';
import type {Locale} from '@/lib/navigation';

export default function AboutPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  return <AboutContent />;
}
