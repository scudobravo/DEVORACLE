import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale, type Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { buildGuidePages, getSeoBundle } from "@/lib/seo-locales";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { meta } = getSeoBundle(locale);
  return {
    title: meta.guidesIndex.title,
    description: meta.guidesIndex.description,
    alternates: buildLocaleAlternates(withLocale("/guides", locale)),
    openGraph: {
      title: meta.guidesIndex.ogTitle,
      description: meta.guidesIndex.ogDescription,
    },
  };
}

export default async function GuidesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const dict = getDictionary(locale);
  const bundle = getSeoBundle(loc);
  const idx = bundle.index.guides;
  const guidePages = buildGuidePages(bundle);

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={loc} nav={dict.nav} switcher={dict.localeSwitcher} logoAlt={dict.meta.logoAlt} />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <h1 className="font-headline mb-4 text-4xl font-extrabold tracking-tight">{idx.h1}</h1>
        <p className="mb-10 max-w-3xl text-lg text-on-surface-variant">{idx.intro}</p>
        <div className="space-y-6">
          {guidePages.map((guide) => (
            <article key={guide.slug} className="rounded-2xl border border-white/10 bg-surface-container p-6">
              <h2 className="mb-2 text-2xl font-bold">{guide.title}</h2>
              <p className="mb-4 leading-7 text-on-surface-variant">{guide.description}</p>
              <Link
                className="font-semibold text-indigo-300 hover:text-indigo-200"
                href={withLocale(`/guides/${guide.slug}`, loc)}
              >
                {idx.readGuide}
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
