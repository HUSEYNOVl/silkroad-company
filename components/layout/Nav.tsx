'use client';

import {useEffect, useState} from 'react';
import {Bot, ChevronDown, Menu, X} from 'lucide-react';
import {useMessages, useTranslations} from 'next-intl';
import {AnimatePresence, motion} from 'framer-motion';
import {usePathname} from 'next/navigation';
import {Link, pathnames} from '@/lib/navigation';
import {LanguageSwitcher} from './LanguageSwitcher';
import {cn} from '@/lib/utils';
import {useAIChat} from '@/contexts/AIChatContext';

type AppPath = keyof typeof pathnames;
type StaticPath = Exclude<AppPath, '/categories/[category]' | '/case-studies/[slug]' | '/blog/[slug]'>;
type ServiceMenuItem = {
  href: StaticPath;
  title: string;
  text: string;
};
type NavMessages = {
  nav: {
    servicesMenu: ServiceMenuItem[];
  };
};

type NavKey = 'services' | 'howItWorks' | 'categories' | 'about' | 'blog' | 'quote' | 'contact';

const navItems: Array<[NavKey, StaticPath]> = [
  ['howItWorks', '/how-it-works'],
  ['categories', '/categories'],
  ['about', '/about'],
  ['blog', '/blog']
];

export function Nav() {
  const t = useTranslations('nav');
  const messages = useMessages() as unknown as NavMessages;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const {open: openChat} = useAIChat();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : Boolean(pathname?.includes(href));

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[72px] transition-all duration-300 ease-silk',
        scrolled
          ? 'border-b border-border bg-bg-primary/95 shadow-card backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <nav className="container-grid flex h-full items-center justify-between" aria-label={t('primaryNav')}>
        <Link
          href="/"
          className="group flex items-center gap-2 text-[15px] font-bold text-fg-primary tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M3 8L8 3L13 8L8 13L3 8Z" fill="white" fillOpacity="0.9"/>
              <path d="M8 3L13 8" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
            </svg>
          </span>
          {t('brand')}
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className={cn(
                'relative inline-flex items-center gap-1 text-sm font-medium transition-colors',
                isActive('/services') ? 'text-fg-primary' : 'text-fg-secondary hover:text-fg-primary'
              )}
            >
              {t('services')}
              <ChevronDown className="h-4 w-4" aria-hidden />
              {isActive('/services') && <ActiveLine />}
            </Link>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 8}}
                  transition={{duration: 0.2}}
                  className="absolute start-0 top-8 w-[560px] rounded-2xl border border-border bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {messages.nav.servicesMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block border border-transparent p-4 transition-colors hover:border-accent/20 hover:bg-bg-secondary"
                      >
                        <span className="text-sm font-semibold text-fg-primary">{item.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-fg-secondary">{item.text}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navItems.map(([key, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative text-sm font-medium transition-colors',
                isActive(href) ? 'text-fg-primary' : 'text-fg-secondary hover:text-fg-primary'
              )}
            >
              {t(key)}
              {isActive(href) && <ActiveLine />}
            </Link>
          ))}
          <div className="border-s border-border ps-6">
            <LanguageSwitcher dark={false} />
          </div>
          <button
            type="button"
            onClick={() => openChat()}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-5 text-xs font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-[0_0_16px_rgba(0,113,227,0.35)]"
          >
            <Bot className="h-3.5 w-3.5" aria-hidden />
            {t('aiAssistant')}
          </button>
          <Link
            href="/quote"
            className="inline-flex h-9 items-center rounded-full border border-border bg-bg-secondary px-5 text-xs font-semibold text-fg-primary transition-colors hover:border-accent/30 hover:bg-white"
          >
            {t('quoteCta')}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-fg-primary transition-colors lg:hidden"
          onClick={() => setOpen(true)}
          aria-label={t('menu')}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0, y: -8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
            className="fixed inset-0 z-50 flex flex-col bg-bg-primary"
          >
            <div className="container-grid flex h-[72px] items-center justify-between border-b border-border">
              <Link href="/" className="flex items-center gap-2 text-[15px] font-bold tracking-tight" onClick={() => setOpen(false)}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M3 8L8 3L13 8L8 13L3 8Z" fill="white" fillOpacity="0.9"/>
                  </svg>
                </span>
                {t('brand')}
              </Link>
              <button type="button" className="flex h-11 w-11 items-center justify-center" onClick={() => setOpen(false)} aria-label={t('close')}>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="container-grid flex flex-1 flex-col justify-center gap-2">
              {[
                ['services', '/services'],
                ...navItems,
                ['quote', '/quote'],
                ['contact', '/contact']
              ].map(([key, href], index) => (
                <motion.div
                  key={href}
                  initial={{opacity: 0, x: -16}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                >
                  <Link
                    href={href as StaticPath}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'group flex items-center gap-4 py-4 font-display text-3xl font-medium transition-colors',
                      isActive(href as string) ? 'text-accent' : 'text-fg-primary hover:text-accent'
                    )}
                  >
                    <span className="font-mono text-xs text-fg-tertiary">{String(index + 1).padStart(2, '0')}</span>
                    {t(key as NavKey)}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="container-grid border-t border-border pb-10 pt-6">
              <LanguageSwitcher dark={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ActiveLine() {
  return (
    <motion.span
      layoutId="nav-indicator"
      className="absolute -bottom-1 inset-x-0 h-px bg-accent"
      transition={{type: 'spring', stiffness: 500, damping: 40}}
    />
  );
}
