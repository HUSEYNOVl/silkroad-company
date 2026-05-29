import {unstable_setRequestLocale} from 'next-intl/server';
import {HomeContent} from '@/components/sections/home/HomeContent';
import type {Locale} from '@/lib/navigation';

export default function Home({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  return <HomeContent />;
}
