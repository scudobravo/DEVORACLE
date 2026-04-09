import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { notFound } from "next/navigation";
import { getAppDisplayName } from "@/lib/download-env";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.welcome.title,
    description: dict.meta.welcome.description,
    alternates: buildLocaleAlternates(withLocale("/welcome", locale)),
  };
}

export default async function WelcomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { plan } = await searchParams;
  const dict = getDictionary(locale);
  const isInterviewPass = plan === "pass";
  const appName = getAppDisplayName();
  const w = dict.welcome;

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={locale} nav={dict.nav} switcher={dict.localeSwitcher} />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center">
        <h1 className="font-headline mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">{w.title}</h1>

        <p className="mb-4 text-lg text-on-surface">
          {isInterviewPass ? w.passLine : w.proLine}
        </p>

        <p className="mb-10 text-on-surface-variant">{w.body}</p>

        <Link
          href={withLocale("/login", locale)}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-8 py-4 font-bold text-white transition hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
        >
          {w.cta}
        </Link>

        <div className="mt-14 rounded-2xl border border-white/10 bg-surface-container/60 px-6 py-8">
          <p className="mb-4 text-base text-on-surface">{w.downloadWaitTitle}</p>
          <Link
            href={withLocale("/download", locale)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-8 py-4 font-bold text-on-surface ring-1 ring-white/15 transition hover:bg-white/15"
          >
            {w.downloadCta.replace("{appName}", appName)}
          </Link>
          <p className="mt-4 text-sm text-on-surface-variant">{w.downloadNote}</p>
        </div>
      </main>
    </>
  );
}
