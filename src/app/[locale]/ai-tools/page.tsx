import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale, type Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { getSeoBundle } from "@/lib/seo-locales";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { meta } = getSeoBundle(locale);
  return {
    title: meta.aiToolsIndex.title,
    description: meta.aiToolsIndex.description,
    alternates: buildLocaleAlternates(withLocale("/ai-tools", locale)),
    openGraph: {
      title: meta.aiToolsIndex.ogTitle,
      description: meta.aiToolsIndex.ogDescription,
    },
  };
}

export default async function AiToolsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const dict = getDictionary(locale);
  const bundle = getSeoBundle(loc);
  const idx = bundle.index.aiTools;

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={loc} nav={dict.nav} switcher={dict.localeSwitcher} logoAlt={dict.meta.logoAlt} />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <h1 className="font-headline mb-4 text-4xl font-extrabold tracking-tight">{idx.h1}</h1>
        <p className="mb-8 max-w-3xl text-lg text-on-surface-variant">{idx.intro}</p>
        <section className="mb-10 rounded-2xl border border-white/10 bg-surface-container p-6">
          <h2 className="mb-4 text-2xl font-bold">{idx.chooseTitle}</h2>
          <div className="space-y-4 leading-8 text-on-surface-variant">
            <p>{idx.chooseP1}</p>
            <p>{idx.chooseP2}</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {bundle.aiToolsPages.map((tool) => (
            <article key={tool.slug} className="rounded-2xl border border-white/10 bg-surface-container p-6">
              <h2 className="mb-2 text-2xl font-bold">{tool.title}</h2>
              <p className="mb-4 leading-7 text-on-surface-variant">{tool.description}</p>
              <Link
                className="font-semibold text-indigo-300 hover:text-indigo-200"
                href={withLocale(`/ai-tools/${tool.slug}`, loc)}
              >
                {idx.openTool}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
          <h2 className="mb-4 text-2xl font-bold">{idx.relatedTitle}</h2>
          <ul className="space-y-3">
            <li>
              <Link
                className="font-semibold text-indigo-300 hover:text-indigo-200"
                href={withLocale(idx.relatedBestAi.href, loc)}
              >
                {idx.relatedBestAi.label}
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-indigo-300 hover:text-indigo-200"
                href={withLocale(idx.relatedHowTo.href, loc)}
              >
                {idx.relatedHowTo.label}
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-indigo-300 hover:text-indigo-200"
                href={withLocale(idx.relatedPlaybook.href, loc)}
              >
                {idx.relatedPlaybook.label}
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
