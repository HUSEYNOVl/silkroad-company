'use client';

import {useEffect, useRef, useState} from 'react';
import {useMessages, useTranslations, useLocale} from 'next-intl';
import {
  motion, useInView, useMotionValue, useTransform, animate, AnimatePresence
} from 'framer-motion';
import {
  Activity, BadgeCheck, Bot, Boxes, Car, Check, ChevronDown, ChevronUp,
  Factory, FileCheck, Gift, Handshake, Heart, Home as HomeIcon, Languages,
  MessageSquare, Monitor, Package, PawPrint, Search, Settings, ShieldCheck,
  Ship, Shirt, Sparkles, Wrench, ArrowRight, Zap, Camera, ClipboardList,
  ScanLine, Globe, Truck, Star, AlertCircle, X
} from 'lucide-react';
import Image from 'next/image';
import {Link} from '@/lib/navigation';
import {fadeUp, stagger, viewport} from '@/lib/motion';
import {useAIChat} from '@/contexts/AIChatContext';
import {loc} from '@/lib/sanity/types';
import {urlForImage} from '@/lib/sanity/image';
import type {SanityHomepage, SanityCategory, SanityService, SanityFaq, SanityCaseStudy, SanityRegionalRoute} from '@/lib/sanity/types';

type Pair = [string, string];
type LinkItem = {label: string; href: string};
type ServiceCard = {title: string; text: string; href: string};
type CategoryCard = {name: string; slug: string; image: string};
type CaseStudy = {tag: string; destination: string; title: string; metrics: Pair[]; href: string};
type FaqItem = {question: string; answer: string};
type HomeMessages = {
  home: {
    trust: {stats: Pair[]};
    audience: {items: LinkItem[]};
    problem: {items: Pair[]};
    process: {items: Pair[]};
    services: {items: ServiceCard[]};
    categories: {items: CategoryCard[]};
    quality: {stages: Pair[]};
    regional: {countries: string[]};
    caseStudies: {items: CaseStudy[]};
    faq: {items: FaqItem[]};
  };
};

const toolIcons = [Bot, Search, Factory, BadgeCheck, ShieldCheck, Package, Ship, MessageSquare];
const categoryIcons: Record<string, React.ElementType> = {
  'electronics': Monitor,
  'home-goods': HomeIcon,
  'beauty': Sparkles,
  'fashion': Shirt,
  'packaging': Package,
  'industrial': Settings,
  'furniture': HomeIcon,
  'toys': Gift,
  'auto-parts': Car,
  'medical-supplies': Heart,
  'sports-goods': Activity,
  'pet-products': PawPrint,
};

const categoryMOQ: Record<string, string> = {
  'electronics': '200–5,000',
  'home-goods': '100–2,000',
  'beauty': '500–3,000',
  'fashion': '200–1,000',
  'packaging': '1,000–50,000',
  'industrial': '50–500',
  'furniture': '50–500',
  'toys': '500–5,000',
  'auto-parts': '100–2,000',
  'medical-supplies': '500–10,000',
  'sports-goods': '200–2,000',
  'pet-products': '200–3,000',
};

/* ─────────────────────────────────────────────────────────────────────────── */

interface HomeContentProps {
  cmsHomepage?: SanityHomepage | null;
  cmsCategories?: SanityCategory[];
  cmsServices?: SanityService[];
  cmsFaqs?: SanityFaq[];
  cmsCaseStudies?: SanityCaseStudy[];
  cmsRoutes?: SanityRegionalRoute[];
}

export function HomeContent({cmsHomepage, cmsCategories = [], cmsServices = [], cmsFaqs = [], cmsCaseStudies = [], cmsRoutes = []}: HomeContentProps) {
  const messages = useMessages() as unknown as HomeMessages;

  return (
    <>
      <Hero cmsData={cmsHomepage} />
      <TrustBar stats={messages.home.trust.stats} cmsStats={cmsHomepage?.trustStats} />
      <AiDiscoverySection />
      <CategoryCardsSection items={messages.home.categories.items} cmsItems={cmsCategories} />
      <ToolsSection items={messages.home.services.items} cmsItems={cmsServices} />
      <AICenterSection />
      <ProcessSteps items={messages.home.process.items} cmsSteps={cmsHomepage?.processSteps} />
      <SupplierComparisonSection />
      <QualityProcess stages={messages.home.quality.stages} />
      <RegionalMap countries={messages.home.regional.countries} cmsRoutes={cmsRoutes} cmsQuote={cmsHomepage?.regionalQuote} />
      <CaseStudiesSection items={messages.home.caseStudies.items} cmsItems={cmsCaseStudies} />
      <FaqSection items={messages.home.faq.items} cmsItems={cmsFaqs} />
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Silk Road',
            url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sarkhan.com',
            areaServed: messages.home.regional.countries
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: messages.home.faq.items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {'@type': 'Answer', text: item.answer}
            }))
          })
        }}
      />
    </>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */

function Hero({cmsData}: {cmsData?: SanityHomepage | null}) {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const {open: openChat} = useAIChat();
  const fallbackTrustItems = t.raw('trustItems') as string[];

  const eyebrow = loc(cmsData?.heroEyebrow, locale) || t('eyebrow');
  const title = loc(cmsData?.heroTitle, locale) || t('title');
  const subtitle = loc(cmsData?.heroSubtitle, locale) || t('subtitle');
  const primaryCta = loc(cmsData?.heroPrimaryCta, locale) || t('primaryCta');
  const secondaryCta = loc(cmsData?.heroSecondaryCta, locale) || t('secondaryCta');

  // Hero background: CMS image > local image > white
  const cmsBgUrl = cmsData?.heroBackgroundImage ? urlForImage(cmsData.heroBackgroundImage, 1920) : '';
  const bgUrl = cmsBgUrl || '/images/backgroundimage.png';

  // Trust items: CMS > fallback from messages
  const trustItems: string[] = cmsData?.heroTrustItems?.length
    ? cmsData.heroTrustItems.map((item) => loc(item, locale) || loc(item, 'en') || '').filter(Boolean)
    : fallbackTrustItems;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: `url(${bgUrl})`}}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-white/70" />
      {/* Subtle grid dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{backgroundImage: 'radial-gradient(circle, #1d1d1f 1px, transparent 1px)', backgroundSize: '32px 32px'}}
      />
      {/* Soft blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_70%_40%,rgba(0,113,227,0.05)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_5%_80%,rgba(0,113,227,0.03)_0%,transparent_55%)]" />

      <div className="container-grid relative w-full py-32 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="mx-auto w-full max-w-3xl text-center">

          {/* Platform badge */}
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.45}}
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3.5 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(0,113,227,0.8)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="mt-5 font-sans font-bold leading-[1.06] tracking-tight text-fg-primary text-[2.4rem] md:text-[3.2rem] xl:text-[4rem]">
            {title.split(' ').map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden me-[0.22em]">
                <motion.span
                  className="inline-block"
                  initial={{y: '105%', opacity: 0}}
                  animate={{y: '0%', opacity: 1}}
                  transition={{duration: 0.7, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1]}}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.55, delay: 0.65}}
            className="mx-auto mt-5 max-w-[600px] text-base leading-[1.75] text-fg-secondary md:text-[17px]"
          >
            {subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.80}}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => openChat()}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_28px_rgba(0,113,227,0.40)] hover:scale-[1.02]"
            >
              <Bot className="h-4 w-4" aria-hidden />
              {primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <Link
              href="/quote"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-fg-primary/12 bg-bg-secondary px-7 text-sm font-semibold text-fg-secondary transition-all duration-200 hover:border-accent/25 hover:text-fg-primary hover:bg-white"
            >
              {secondaryCta}
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, delay: 1.0}}
            className="mt-8 flex flex-wrap justify-center items-center gap-x-5 gap-y-2"
          >
            {trustItems.map((item, i) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-fg-tertiary">
                {i > 0 && <span className="h-px w-3 bg-border" aria-hidden />}
                <Check className="h-3 w-3 text-accent/70 shrink-0" aria-hidden />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1.8, duration: 0.6}}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-tertiary/40">Scroll</span>
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-transparent to-fg-tertiary/20"
          animate={{scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3]}}
          transition={{repeat: Infinity, duration: 2, ease: 'easeInOut'}}
        />
      </motion.div>
    </section>
  );
}

/* ─── TrustBar ─────────────────────────────────────────────────────────────── */

function TrustBar({stats, cmsStats}: {stats: Pair[]; cmsStats?: SanityHomepage['trustStats']}) {
  const locale = useLocale();

  // Use CMS stats if available and have data, else fall back to messages
  const displayStats: Pair[] = cmsStats && cmsStats.length > 0
    ? cmsStats.map((s) => [s.value, loc(s.label, locale) || loc(s.label, 'en') || ''] as Pair)
    : stats;

  return (
    <section className="border-y border-[rgba(0,0,0,0.06)] bg-bg-secondary py-0">
      <div className="container-grid">
        <div className="grid grid-cols-2 md:grid-cols-5">
          {displayStats.map(([value, label], index) => (
            <div
              key={label}
              className="flex flex-col items-center py-7 text-center md:border-s md:border-[rgba(0,0,0,0.06)] first:border-s-0"
            >
              <CounterStat value={value} label={label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterStat({value, label}: {value: string; label: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true});
  const count = useMotionValue(0);
  const numeric = Number.parseInt(value, 10);
  const display = useTransform(count, (latest) => {
    if (Number.isNaN(numeric)) return value;
    return `${Math.round(latest)}${value.replace(String(numeric), '')}`;
  });

  useEffect(() => {
    if (!inView || Number.isNaN(numeric)) return;
    const controls = animate(count, numeric, {duration: 1.6, ease: [0.22, 1, 0.36, 1]});
    return controls.stop;
  }, [count, inView, numeric]);

  return (
    <div ref={ref}>
      <motion.p className="text-3xl font-bold tracking-tight text-accent md:text-4xl">{display}</motion.p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary">{label}</p>
    </div>
  );
}

/* ─── AI Discovery Section ─────────────────────────────────────────────────── */

function AiDiscoverySection() {
  const t = useTranslations('home.aiSearch');
  const {open: openChat} = useAIChat();
  const [inputVal, setInputVal] = useState('');
  const suggestions = t.raw('suggestions') as string[];

  function submit(text: string) {
    const msg = text.trim();
    if (!msg) return;
    setInputVal('');
    openChat(msg);
  }

  return (
    <section className="bg-white py-20">
      <div className="container-grid">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-5 bg-accent" aria-hidden />
            {t('eyebrow')}
            <span className="h-px w-5 bg-accent" aria-hidden />
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 text-[2rem] font-bold tracking-tight text-fg-primary md:text-[2.5rem]">
            {t('title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-fg-secondary">
            {t('subtitle')}
          </motion.p>

          {/* Large search input */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-bg-secondary px-5 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all focus-within:border-accent/40 focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.08)]"
          >
            <Search className="h-4.5 w-4.5 shrink-0 text-fg-tertiary" aria-hidden />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit(inputVal)}
              placeholder={t('placeholder')}
              className="flex-1 bg-transparent text-sm text-fg-primary placeholder:text-fg-tertiary outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openChat()}
                title="Upload photo"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(0,0,0,0.05)] text-fg-tertiary transition-colors hover:bg-accent/10 hover:text-accent"
              >
                <ScanLine className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => submit(inputVal)}
                className="flex h-8 items-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                <Bot className="h-3.5 w-3.5" aria-hidden />
                AI
              </button>
            </div>
          </motion.div>

          {/* Suggestion chips */}
          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="rounded-full border border-[rgba(0,0,0,0.08)] bg-bg-secondary px-3.5 py-1.5 text-xs text-fg-secondary transition-all hover:border-accent/25 hover:bg-accent/5 hover:text-accent"
              >
                {s}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Category Cards Section ───────────────────────────────────────────────── */

function CategoryCardsSection({items, cmsItems}: {items: CategoryCard[]; cmsItems: SanityCategory[]}) {
  const t = useTranslations('home.categories');
  const locale = useLocale();

  // Build display items: CMS first, fall back to messages
  const displayItems = cmsItems.length > 0
    ? cmsItems.slice(0, 8).map((c) => ({
        slug: c.slug.current,
        name: loc(c.name, locale) || loc(c.name, 'en') || c.slug.current,
        moq: c.moqRange ?? '100–2,000',
        hasOEM: c.hasOEM ?? true,
        hasInspection: c.hasInspection ?? true,
      }))
    : items.slice(0, 8).map((item) => ({
        slug: item.slug,
        name: item.name,
        moq: categoryMOQ[item.slug] ?? '100–2,000',
        hasOEM: true,
        hasInspection: true,
      }));

  return (
    <section className="bg-bg-secondary py-24">
      <div className="container-grid">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {displayItems.map((item) => {
            const Icon = categoryIcons[item.slug] ?? Package;
            const moq = item.moq;
            return (
              <motion.article
                key={item.slug}
                variants={fadeUp}
                className="group rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-fg-primary">{item.name}</h3>
                <div className="mt-3 space-y-1.5">
                  <DataRow label="MOQ" value={`${moq} units`} />
                  <DataRow label="OEM" value={item.hasOEM ? 'Available' : 'N/A'} positive={item.hasOEM} />
                  <DataRow label="Inspection" value={item.hasInspection ? 'Included' : 'N/A'} positive={item.hasInspection} />
                </div>
                <Link
                  href={{pathname: '/categories/[category]', params: {category: item.slug}}}
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-accent transition-all group-hover:gap-1.5"
                >
                  {t('source')}
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 text-center"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3"
          >
            View all 120+ categories
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function DataRow({label, value, positive = false}: {label: string; value: string; positive?: boolean}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-fg-tertiary">{label}</span>
      <span className={`text-[11px] font-semibold ${positive ? 'text-green-600' : 'text-fg-primary'}`}>
        {positive && <Check className="inline h-3 w-3 me-0.5" />}
        {value}
      </span>
    </div>
  );
}

/* ─── Tools Section ────────────────────────────────────────────────────────── */

const toolBadges = ['AI-powered', 'Core', 'Core', 'Core', 'Core', 'Core', 'Core', 'Instant'];

function ToolsSection({items, cmsItems}: {items: ServiceCard[]; cmsItems: SanityService[]}) {
  const t = useTranslations('home.tools');
  const locale = useLocale();

  // Merge: CMS services if available, else messages
  const displayItems: ServiceCard[] = cmsItems.length > 0
    ? cmsItems.map((s) => ({
        title: loc(s.title, locale) || loc(s.title, 'en') || '',
        text: loc(s.description, locale) || loc(s.description, 'en') || '',
        href: `/services/${s.slug.current}`,
      }))
    : items;

  return (
    <section className="bg-white py-24">
      <div className="container-grid">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {displayItems.map((item, index) => {
            const Icon = toolIcons[index] ?? Search;
            const badge = toolBadges[index] ?? 'Core';
            return (
              <motion.article
                key={item.href}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                    <Icon className="h-5 w-5 text-accent" aria-hidden />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    badge === 'AI-powered'
                      ? 'bg-accent/10 text-accent'
                      : badge === 'Instant'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-bg-secondary text-fg-tertiary'
                  }`}>
                    {badge}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-fg-primary leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-secondary line-clamp-3">{item.text}</p>
                <Link
                  href={item.href as '/services'}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-all group-hover:gap-2.5"
                >
                  {t('learnMore')}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── AI Center Section ────────────────────────────────────────────────────── */

function AICenterSection() {
  const {open: openChat} = useAIChat();
  const tNav = useTranslations('nav');

  const features = [
    {icon: MessageSquare, text: 'Describe your product in any language — text, photo, or link'},
    {icon: Search, text: 'AI identifies the product, asks the right questions'},
    {icon: FileCheck, text: 'Sourcing request is prepared with your unique lead code'},
    {icon: Zap, text: 'Continue on WhatsApp with all details pre-filled'},
  ];

  return (
    <section className="relative overflow-hidden bg-fg-primary py-28">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px'}}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(0,113,227,0.10)_0%,transparent_70%)]" />
      <div className="container-grid relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          {/* Left: text */}
          <div>
            <motion.p variants={fadeUp} className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              AI Sourcing
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-[2rem] font-bold tracking-tight text-white md:text-[2.6rem]">
              Start with AI. Your sourcing request in 3 messages.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg text-white/55">
              No forms, no waiting. Send a product name, photo, or link — the AI extracts what it needs and creates a lead code your team can act on.
            </motion.p>
            <motion.ul variants={stagger} className="mt-8 space-y-4">
              {features.map(({icon: Icon, text}) => (
                <motion.li key={text} variants={fadeUp} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <Icon className="h-4 w-4 text-accent" aria-hidden />
                  </div>
                  <p className="text-sm leading-relaxed text-white/65">{text}</p>
                </motion.li>
              ))}
            </motion.ul>
            <motion.button
              variants={fadeUp}
              type="button"
              onClick={() => openChat()}
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(0,113,227,0.45)]"
            >
              <Bot className="h-4 w-4" aria-hidden />
              {tNav('aiAssistant')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </motion.button>
          </div>

          {/* Right: lead code flow */}
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/10 blur-2xl" />
            <div className="relative space-y-3">
              {[
                {step: '01', text: 'You send product details to AI', status: 'done'},
                {step: '02', text: 'AI extracts: product · qty · destination · OEM', status: 'done'},
                {step: '03', text: 'Lead code generated: SR-241105', status: 'active'},
                {step: '04', text: 'Continue on WhatsApp with details pre-filled', status: 'pending'},
              ].map(({step, text, status}) => (
                <div
                  key={step}
                  className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-all ${
                    status === 'active'
                      ? 'border-accent/50 bg-accent/10'
                      : status === 'done'
                      ? 'border-white/8 bg-white/4'
                      : 'border-white/5 bg-white/2 opacity-50'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold ${
                      status === 'active' ? 'text-accent' : status === 'done' ? 'text-white/40' : 'text-white/20'
                    }`}
                  >
                    {step}
                  </span>
                  <p className={`text-sm ${status === 'active' ? 'font-semibold text-accent' : status === 'done' ? 'text-white/60' : 'text-white/30'}`}>
                    {text}
                  </p>
                  {status === 'done' && (
                    <Check className="ms-auto h-4 w-4 shrink-0 text-green-400" aria-hidden />
                  )}
                  {status === 'active' && (
                    <div className="ms-auto h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,113,227,0.8)]" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Process Steps ────────────────────────────────────────────────────────── */

function ProcessSteps({items, cmsSteps}: {items: Pair[]; cmsSteps?: SanityHomepage['processSteps']}) {
  const t = useTranslations('home.process');
  const locale = useLocale();

  const displayItems: Pair[] = cmsSteps && cmsSteps.length > 0
    ? cmsSteps.map((s) => [
        loc(s.title, locale) || loc(s.title, 'en') || '',
        loc(s.text, locale) || loc(s.text, 'en') || '',
      ] as Pair)
    : items;

  return (
    <section className="bg-white py-24">
      <div className="container-grid">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map(([title, text], index) => (
            <motion.article
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="group relative rounded-2xl border border-[rgba(0,0,0,0.08)] bg-bg-secondary p-6 transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                <span className="font-mono text-xs font-bold text-accent">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 font-semibold text-fg-primary leading-snug">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{text}</p>
            </motion.article>
          ))}
        </div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10"
        >
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3"
          >
            {t('cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Supplier Comparison Section ──────────────────────────────────────────── */

const supplierDemo = [
  {
    rank: 1,
    name: 'Factory A',
    location: 'Guangzhou, GD',
    status: 'verified' as const,
    moq: '200 units',
    priceRange: '$2.50 – $3.20',
    oem: true,
    sample: true,
    risk: 'Low',
    highlight: true,
  },
  {
    rank: 2,
    name: 'Factory B',
    location: 'Dongguan, GD',
    status: 'verified' as const,
    moq: '500 units',
    priceRange: '$2.10 – $2.80',
    oem: true,
    sample: true,
    risk: 'Medium',
    highlight: false,
  },
  {
    rank: 3,
    name: 'Factory C',
    location: 'Shenzhen, GD',
    status: 'checking' as const,
    moq: '100 units',
    priceRange: '$3.00 – $4.00',
    oem: false,
    sample: false,
    risk: 'Unknown',
    highlight: false,
  },
];

function SupplierComparisonSection() {
  const t = useTranslations('home.supplierComparison');
  return (
    <section className="bg-bg-secondary py-24">
      <div className="container-grid">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 grid gap-5 lg:grid-cols-3"
        >
          {supplierDemo.map((s) => (
            <motion.div
              key={s.name}
              variants={fadeUp}
              className={`relative rounded-2xl border bg-white p-6 transition-all ${
                s.highlight
                  ? 'border-accent/40 shadow-[0_0_0_4px_rgba(0,113,227,0.06),0_8px_32px_rgba(0,0,0,0.10)]'
                  : 'border-[rgba(0,0,0,0.08)] shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
              }`}
            >
              {s.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(0,113,227,0.35)]">
                    Recommended
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-secondary">
                      <Factory className="h-4 w-4 text-fg-tertiary" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-fg-primary">{s.name}</p>
                      <p className="text-[11px] text-fg-tertiary">{s.location}</p>
                    </div>
                  </div>
                </div>
                <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                  s.status === 'verified'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}>
                  {s.status === 'verified'
                    ? <><Check className="h-3 w-3" />Verified</>
                    : <><AlertCircle className="h-3 w-3" />Checking</>
                  }
                </span>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-[rgba(0,0,0,0.06)]" />

              {/* Data rows */}
              <div className="space-y-3">
                <CompareRow label="MOQ" value={s.moq} />
                <CompareRow label="Price range" value={s.priceRange} />
                <CompareRow label="OEM support" value={s.oem ? 'Available' : 'Not available'} positive={s.oem} />
                <CompareRow label="Sample" value={s.sample ? 'Available' : 'TBD'} positive={s.sample} />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-fg-tertiary">Risk level</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    s.risk === 'Low' ? 'bg-green-50 text-green-700' :
                    s.risk === 'Medium' ? 'bg-amber-50 text-amber-700' :
                    'bg-bg-secondary text-fg-tertiary'
                  }`}>
                    {s.risk}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 text-xs text-fg-tertiary text-center"
        >
          * {t('note')}
        </motion.p>
      </div>
    </section>
  );
}

function CompareRow({label, value, positive = false}: {label: string; value: string; positive?: boolean}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-fg-tertiary">{label}</span>
      <span className={`text-[11px] font-semibold ${
        positive === true ? 'text-green-600' : positive === false && value.includes('Not') ? 'text-fg-tertiary line-through' : 'text-fg-primary'
      }`}>
        {value}
      </span>
    </div>
  );
}

/* ─── Quality Process ──────────────────────────────────────────────────────── */

function QualityProcess({stages}: {stages: Pair[]}) {
  const t = useTranslations('home.quality');
  return (
    <section className="bg-white py-24">
      <div className="container-grid grid gap-16 lg:grid-cols-2 lg:items-start">
        {/* Left: checklist */}
        <div>
          <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-10 space-y-4"
          >
            {stages.map(([title, text], index) => (
              <motion.div key={title} variants={fadeUp} className="group flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/5 transition-all group-hover:bg-accent/15">
                  <span className="font-mono text-xs font-bold text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-fg-primary">{title}</p>
                  <p className="mt-0.5 text-sm text-fg-secondary">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <Link
            href="/services/quality-inspection"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3"
          >
            {t('cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* Right: inspection report mockup */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            {/* Report header */}
            <div className="flex items-start justify-between border-b border-[rgba(0,0,0,0.06)] pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-fg-tertiary">Inspection Report</p>
                <p className="mt-1 font-mono text-lg font-bold text-accent">SR-241105</p>
                <p className="mt-1 text-xs text-fg-tertiary">Custom Water Bottles · 500 units</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ PASSED
              </span>
            </div>

            {/* Checklist */}
            <div className="mt-5 space-y-3">
              {[
                'Product specification confirmed',
                'Materials and color verified',
                'Sample photos reviewed (12 photos)',
                'Quantity: 500/500 units present',
                'OEM packaging: compliant',
                'Export marks and labels: correct',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-3 w-3 text-green-600" aria-hidden />
                  </div>
                  <span className="text-sm text-fg-secondary">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats strip */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-bg-secondary p-4">
              {[
                {value: '98%', label: 'Pass rate'},
                {value: '0', label: 'Defects found'},
                {value: '12', label: 'Photos sent'},
              ].map(({value, label}) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-accent">{value}</p>
                  <p className="mt-0.5 text-xs text-fg-tertiary">{label}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.06)] bg-bg-secondary px-4 py-3">
              <Camera className="h-4 w-4 shrink-0 text-fg-tertiary" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-fg-primary">Photo & video proof sent</p>
                <p className="text-xs text-fg-tertiary">Buyer approved before shipment release</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Regional Map ─────────────────────────────────────────────────────────── */

function RegionalMap({countries, cmsRoutes, cmsQuote}: {countries: string[]; cmsRoutes: SanityRegionalRoute[]; cmsQuote?: any}) {
  const t = useTranslations('home.regional');
  const locale = useLocale();

  const fallbackRoutes = [
    {from: 'Guangzhou', to: 'Baku', flag: '🇦🇿', mode: 'Sea + Land', days: '15–20d'},
    {from: 'Guangzhou', to: 'Istanbul', flag: '🇹🇷', mode: 'Sea / Air', days: '20–35d'},
    {from: 'Guangzhou', to: 'Dubai', flag: '🇦🇪', mode: 'Sea / Air', days: '15–25d'},
    {from: 'Guangzhou', to: 'Moscow', flag: '🇷🇺', mode: 'Rail / Sea', days: '18–28d'},
    {from: 'Guangzhou', to: 'Berlin', flag: '🇩🇪', mode: 'Sea / Rail', days: '25–35d'},
  ];
  const displayRoutes = cmsRoutes.length > 0
    ? cmsRoutes.map((r) => ({from: r.from ?? 'Guangzhou', to: r.to, flag: r.flag ?? '', mode: r.mode ?? '', days: r.days ?? ''}))
    : fallbackRoutes;

  const quote = loc(cmsQuote, locale) || loc(cmsQuote, 'en') || '"Biz digər sourcing agentlərinin çoxunun bilmədiyi ticarət marşrutlarını yaxşı tanıyırıq."';

  return (
    <section id="regional" className="relative overflow-hidden bg-fg-primary py-24 text-white">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px'}}
      />
      <div className="container-grid relative">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} dark />
        <p className="mt-5 max-w-2xl text-white/55">{t('text')}</p>

        {/* Route cards */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {displayRoutes.map(({from, to, flag, mode, days}) => (
            <div key={to} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-white/8">
              <div className="flex items-center gap-2">
                <span className="text-lg">{flag}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{to}</p>
                  <p className="text-[10px] text-white/40">{from} →</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/40">Mode</span>
                  <span className="text-[10px] font-medium text-white/70">{mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/40">Transit</span>
                  <span className="text-[10px] font-semibold text-accent">{days}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Country tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {countries.map((country) => (
            <span
              key={country}
              className="rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-sm text-white/65"
            >
              {country}
            </span>
          ))}
        </div>

        {/* Regional quote */}
        {quote && (
          <p className="mt-8 max-w-2xl text-sm italic text-white/35">
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Case Studies ─────────────────────────────────────────────────────────── */

function CaseStudiesSection({items, cmsItems}: {items: CaseStudy[]; cmsItems: SanityCaseStudy[]}) {
  const t = useTranslations('home.caseStudies');
  const locale = useLocale();

  // Build display items: CMS first, else messages
  const displayItems: CaseStudy[] = cmsItems.length > 0
    ? cmsItems.map((c) => ({
        tag: loc(c.tag, locale) || loc(c.tag, 'en') || '',
        destination: c.destination ?? '',
        title: loc(c.title, locale) || loc(c.title, 'en') || '',
        metrics: (c.metrics ?? []).map((m) => [m.value, loc(m.label, locale) || loc(m.label, 'en') || ''] as Pair),
        href: `/case-studies/${c.slug.current}`,
      }))
    : items;

  return (
    <section className="bg-bg-secondary py-24">
      <div className="container-grid">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {displayItems.map((item) => (
            <article
              key={item.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
            >
              <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.06)] px-6 py-4">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-semibold uppercase text-accent">
                  {item.tag}
                </span>
                <span className="text-sm text-fg-tertiary">{item.destination}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-semibold text-fg-primary leading-snug">{item.title}</h3>
                <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-bg-secondary p-4">
                  {item.metrics.map(([value, label]) => (
                    <div key={label} className="text-center">
                      <span className="block text-2xl font-bold text-accent">{value}</span>
                      <span className="text-[11px] text-fg-tertiary">{label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={item.href as '/case-studies'}
                  className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all group-hover:gap-2.5"
                >
                  {t('read')}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────────── */

function FaqSection({items, cmsItems}: {items: FaqItem[]; cmsItems: SanityFaq[]}) {
  const t = useTranslations('home.faq');
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const displayItems: FaqItem[] = cmsItems.length > 0
    ? cmsItems.map((f) => ({
        question: loc(f.question, locale) || loc(f.question, 'en') || '',
        answer: loc(f.answer, locale) || loc(f.answer, 'en') || '',
      }))
    : items;

  return (
    <section className="bg-white py-24">
      <div className="container-grid max-w-[760px]">
        <SectionIntro eyebrow={t('eyebrow')} title={t('title')} />
        <div className="mt-10 space-y-2">
          {displayItems.map((item, index) => (
            <div key={item.question} className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] transition-colors hover:border-accent/25">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-fg-primary">{item.question}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-secondary text-fg-tertiary transition-colors hover:bg-accent/10">
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  )}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-fg-secondary">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────────────────────────────── */

function FinalCta() {
  const t = useTranslations('home.final');
  const tNav = useTranslations('nav');
  const {open: openChat} = useAIChat();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

  return (
    <section className="relative overflow-hidden bg-fg-primary py-28 text-white">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px'}}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(0,113,227,0.18)_0%,transparent_70%)]" />
      <div className="container-grid relative text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
        >
          {t('title')}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-5 max-w-3xl text-[2.2rem] font-bold tracking-tight md:text-[2.8rem]"
        >
          Ready to source your first product from China?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-5 max-w-xl text-lg text-white/55"
        >
          {t('text')}
        </motion.p>

        {/* Three paths */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {/* AI path */}
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 p-6 transition-all hover:border-accent/40 hover:bg-accent/8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 mx-auto">
              <Bot className="h-6 w-6 text-accent" aria-hidden />
            </div>
            <h3 className="mt-4 font-semibold">Start with AI</h3>
            <p className="mt-2 text-sm text-white/50">Fastest way. Describe your product and get a lead code.</p>
            <button
              type="button"
              onClick={() => openChat()}
              className="mt-5 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
            >
              {tNav('aiAssistant')}
            </button>
          </motion.div>

          {/* Quote path */}
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 p-6 transition-all hover:border-white/30 hover:bg-white/8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mx-auto">
              <ClipboardList className="h-6 w-6 text-white/70" aria-hidden />
            </div>
            <h3 className="mt-4 font-semibold">Request a Quote</h3>
            <p className="mt-2 text-sm text-white/50">Fill in product details. We respond within 4 hours.</p>
            <Link
              href="/quote"
              className="mt-5 block rounded-xl border border-white/20 bg-white/10 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-white/20"
            >
              {t('primaryCta')}
            </Link>
          </motion.div>

          {/* WhatsApp path */}
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 p-6 transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/20 mx-auto">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#25D366]" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">WhatsApp Direct</h3>
            <p className="mt-2 text-sm text-white/50">Open a conversation. Our team replies in your language.</p>
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-[#20BA5A]"
            >
              {t('secondaryCta')}
            </a>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 font-mono text-xs uppercase tracking-widest text-white/30"
        >
          {t('note')}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Shared ────────────────────────────────────────────────────────────────── */

function SectionIntro({eyebrow, title, dark = false}: {eyebrow: string; title: string; dark?: boolean}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
      <p className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-5 bg-accent" aria-hidden />
        {eyebrow}
      </p>
      <h2 className={`mt-4 max-w-3xl text-[1.75rem] font-bold tracking-tight md:text-[2.25rem] ${dark ? 'text-white' : 'text-fg-primary'}`}>
        {title}
      </h2>
    </motion.div>
  );
}
