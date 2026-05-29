import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {defaultLocale, locales, type Locale} from './navigation';

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const activeLocale = requested ?? defaultLocale;

  if (!isLocale(activeLocale)) {
    notFound();
  }

  return {
    locale: activeLocale,
    messages: (await import(`../messages/${activeLocale}.json`)).default
  };
});
