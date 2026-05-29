import type {Metadata} from 'next';
import {NextIntlClientProvider, useMessages} from 'next-intl';
import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {Analytics} from '@vercel/analytics/react';
import {Nav} from '@/components/layout/Nav';
import {Footer} from '@/components/layout/Footer';
import {WhatsAppFloat} from '@/components/layout/WhatsAppFloat';
import {ChatWidget} from '@/components/ai/ChatWidget';
import {ChatModal} from '@/components/ai/ChatModal';
import {SmoothScroll, ScrollProgressBar} from '@/components/layout/SmoothScroll';
import {PageTransition} from '@/components/layout/PageTransition';
import {AIChatProvider} from '@/contexts/AIChatContext';
import {isRtl} from '@/lib/utils';
import {locales, type Locale} from '@/lib/navigation';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: {locale: Locale}}): Promise<Metadata> {
  const t = await getTranslations({locale: params.locale, namespace: 'meta'});
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sarkhan.com'),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: '/',
      siteName: 'Silk Road',
      images: [{url: '/images/og.jpg', width: 1200, height: 630}],
      locale: params.locale
    },
    alternates: {
      canonical: `/${params.locale}`,
      languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`]))
    }
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: Locale};
}) {
  unstable_setRequestLocale(params.locale);
  const messages = useMessages();

  return (
    <html lang={params.locale} dir={isRtl(params.locale) ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <AIChatProvider>
            <SmoothScroll>
              <ScrollProgressBar />
              <Nav />
              <PageTransition>
                <main>{children}</main>
              </PageTransition>
              <Footer />
              <WhatsAppFloat />
              <ChatWidget />
              <ChatModal locale={params.locale} />
            </SmoothScroll>
          </AIChatProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
