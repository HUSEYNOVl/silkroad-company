import type {Lead} from '@/lib/supabase/types';

type WhatsAppLabels = {
  intro: string;
  leadCode: string;
  product: string;
  quantity: string;
  destination: string;
  oem: string;
  notes: string;
};

const labels: Record<string, WhatsAppLabels> = {
  en: {
    intro: 'Hi, I want to continue my Silk Road sourcing request.',
    leadCode: 'Lead code',
    product: 'Product',
    quantity: 'Quantity',
    destination: 'Destination',
    oem: 'OEM',
    notes: 'Notes',
  },
  az: {
    intro: 'Salam, Silk Road tədarük sorğumu davam etdirmək istəyirəm.',
    leadCode: 'Lead kodu',
    product: 'Məhsul',
    quantity: 'Miqdar',
    destination: 'Çatdırılma ölkəsi',
    oem: 'OEM',
    notes: 'Qeydlər',
  },
  tr: {
    intro: 'Merhaba, Silk Road tedarik talebimi devam ettirmek istiyorum.',
    leadCode: 'Lead kodu',
    product: 'Ürün',
    quantity: 'Miktar',
    destination: 'Teslimat ülkesi',
    oem: 'OEM',
    notes: 'Notlar',
  },
  ru: {
    intro: 'Здравствуйте, я хочу продолжить мой запрос на закупку через Silk Road.',
    leadCode: 'Код заявки',
    product: 'Товар',
    quantity: 'Количество',
    destination: 'Страна доставки',
    oem: 'OEM',
    notes: 'Примечания',
  },
  ar: {
    intro: 'مرحبًا، أريد متابعة طلب توريدي عبر Silk Road.',
    leadCode: 'رمز الطلب',
    product: 'المنتج',
    quantity: 'الكمية',
    destination: 'بلد التسليم',
    oem: 'OEM',
    notes: 'ملاحظات',
  },
};

export function generateWhatsAppPrefillText(lead: Partial<Lead>, locale = 'en'): string {
  const l = labels[locale] ?? labels.en;
  return [
    l.intro,
    lead.lead_code ? `${l.leadCode}: ${lead.lead_code}` : null,
    lead.product_name ? `${l.product}: ${lead.product_name}` : null,
    lead.quantity ? `${l.quantity}: ${lead.quantity}` : null,
    lead.destination_country ? `${l.destination}: ${lead.destination_country}` : null,
    typeof lead.oem_required === 'boolean' ? `${l.oem}: ${lead.oem_required ? 'yes' : 'no'}` : null,
    lead.notes ? `${l.notes}: ${lead.notes}` : null,
  ].filter(Boolean).join('\n');
}

export function generateWhatsAppLink(lead: Partial<Lead>, locale = 'en'): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(generateWhatsAppPrefillText(lead, locale))}`;
}

export function shouldShowWhatsAppCta(lead: Partial<Lead>): boolean {
  return Boolean(lead.product_name && (lead.quantity || lead.destination_country));
}
