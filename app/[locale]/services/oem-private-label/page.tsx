import {ServiceDetailPage} from '@/components/sections/shared/ServiceDetailPage';
import type {Locale} from '@/lib/navigation';

export default function OemPrivateLabelPage({params}: {params: {locale: Locale}}) {
  return <ServiceDetailPage locale={params.locale} slug="oem-private-label" />;
}
