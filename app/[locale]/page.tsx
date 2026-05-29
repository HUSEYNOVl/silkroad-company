import {unstable_setRequestLocale} from 'next-intl/server';
import {HomeContent} from '@/components/sections/home/HomeContent';
import type {Locale} from '@/lib/navigation';
import {getHomepage, getCategories, getServices, getFaqs, getCaseStudies, getRegionalRoutes} from '@/lib/sanity/queries';

export default async function Home({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);

  // Fetch all CMS data server-side (returns null/[] if CMS not yet configured)
  const [cmsHomepage, cmsCategories, cmsServices, cmsFaqs, cmsCaseStudies, cmsRoutes] = await Promise.all([
    getHomepage(),
    getCategories(),
    getServices(),
    getFaqs(),
    getCaseStudies(),
    getRegionalRoutes(),
  ]);

  return (
    <HomeContent
      cmsHomepage={cmsHomepage}
      cmsCategories={cmsCategories}
      cmsServices={cmsServices}
      cmsFaqs={cmsFaqs}
      cmsCaseStudies={cmsCaseStudies}
      cmsRoutes={cmsRoutes}
    />
  );
}
