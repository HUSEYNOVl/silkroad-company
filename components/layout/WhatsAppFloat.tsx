'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';

export function WhatsAppFloat() {
  const t = useTranslations('common');
  const [show, setShow] = useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '';
  const message = encodeURIComponent(t('whatsappPrefill'));

  useEffect(() => {
    // Show only after the user scrolls past 80% of the viewport height (past the hero)
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;
    function check() {
      setShow(window.scrollY > threshold);
    }
    check();
    window.addEventListener('scroll', check, {passive: true});
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <button
      type="button"
      aria-label={t('whatsappDirect')}
      onClick={() => window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer')}
      className={`fixed bottom-6 end-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 md:bottom-8 md:end-8 ${
        show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="absolute h-14 w-14 animate-[whatsappPulse_8s_ease-out_infinite] rounded-full border border-[#25D366]" />
      <svg aria-hidden viewBox="0 0 32 32" className="relative h-7 w-7 fill-current">
        <path d="M16.04 3.2A12.7 12.7 0 0 0 5.2 22.5L3.7 28l5.65-1.48A12.7 12.7 0 1 0 16.04 3.2Zm0 2.28a10.42 10.42 0 0 1 8.86 15.9 10.43 10.43 0 0 1-14.94 3.12l-.4-.24-3.36.88.9-3.27-.26-.42A10.42 10.42 0 0 1 16.04 5.48Zm-4.2 5.38c-.23 0-.6.08-.92.43-.32.35-1.2 1.18-1.2 2.88 0 1.7 1.23 3.34 1.4 3.57.17.23 2.38 3.8 5.86 5.18 2.9 1.14 3.5.92 4.13.86.63-.06 2.04-.83 2.33-1.63.29-.8.29-1.48.2-1.63-.09-.14-.32-.23-.67-.4-.34-.17-2.04-1-2.36-1.12-.31-.11-.54-.17-.77.18-.23.34-.88 1.12-1.08 1.34-.2.23-.4.25-.74.09-.34-.17-1.45-.53-2.76-1.7-1.02-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.53.15-.7.15-.15.34-.4.52-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.67-.56-.58-.77-.59h-.67Z" />
      </svg>
    </button>
  );
}
