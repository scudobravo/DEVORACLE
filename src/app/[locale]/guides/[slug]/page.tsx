import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { LongFormPageView } from "@/components/seo/LongFormPage";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale, type Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { buildGuidePages, getSeoBundle } from "@/lib/seo-locales";
import { guidePages } from "@/lib/seo-content";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return guidePages.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const bundle = getSeoBundle(locale);
  const page = buildGuidePages(bundle).find((entry) => entry.slug === slug);
  if (!page) notFound();
  return {
    title: page.title,
    description: page.description,
    alternates: buildLocaleAlternates(withLocale(`/guides/${slug}`, locale)),
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const bundle = getSeoBundle(loc);
  const page = buildGuidePages(bundle).find((entry) => entry.slug === slug);
  if (!page) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={loc} nav={dict.nav} switcher={dict.localeSwitcher} logoAlt={dict.meta.logoAlt} />
      <LongFormPageView
        page={page}
        locale={loc}
        sectionLabel={bundle.common.section.guides}
        pathname={`/guides/${slug}`}
        chrome={bundle.common.longForm}
      />
    </>
  );
}
