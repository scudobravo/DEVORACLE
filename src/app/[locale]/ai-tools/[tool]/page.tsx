import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { LongFormPageView } from "@/components/seo/LongFormPage";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale, type Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { getSeoBundle } from "@/lib/seo-locales";
import { aiToolsPages } from "@/lib/seo-content";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; tool: string }>;
};

export function generateStaticParams() {
  return aiToolsPages.map((page) => ({ tool: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, tool } = await params;
  if (!isLocale(locale)) notFound();
  const bundle = getSeoBundle(locale);
  const page = bundle.aiToolsPages.find((entry) => entry.slug === tool);
  if (!page) notFound();
  return {
    title: page.title,
    description: page.description,
    alternates: buildLocaleAlternates(withLocale(`/ai-tools/${tool}`, locale)),
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function AiToolDetailPage({ params }: PageProps) {
  const { locale, tool } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const bundle = getSeoBundle(loc);
  const page = bundle.aiToolsPages.find((entry) => entry.slug === tool);
  if (!page) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={loc} nav={dict.nav} switcher={dict.localeSwitcher} logoAlt={dict.meta.logoAlt} />
      <LongFormPageView
        page={page}
        locale={loc}
        sectionLabel={bundle.common.section.aiTools}
        pathname={`/ai-tools/${tool}`}
        chrome={bundle.common.longForm}
      />
    </>
  );
}
