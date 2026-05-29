import {ServiceDetailPage} from '@/components/sections/shared/ServiceDetailPage';
import type {Locale} from '@/lib/navigation';

export default function ProductSourcingPage({params}: {params: {locale: Locale}}) {
  return <ServiceDetailPage locale={params.locale} slug="product-sourcing" />;
}
