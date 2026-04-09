import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutDownloadButtons } from "@/components/home/CheckoutDownloadButtons";
import { HomePricingSection } from "@/components/home/HomePricingSection";
import { Navigation } from "@/components/Navigation";
import type { Messages } from "@/lib/dictionary";
import { getMacDownloadUrl, getWinDownloadUrl } from "@/lib/download-env";
import type { Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";

type HomeMarketingPageProps = {
  locale: Locale;
  dict: Messages;
};

export function HomeMarketingPage({ locale, dict }: HomeMarketingPageProps) {
  const macUrl = getMacDownloadUrl() || "#";
  const winUrl = getWinDownloadUrl() || "#";
  const home = withLocale("/", locale);
  const h = dict.home;
  const f = dict.footer;

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={locale} nav={dict.nav} switcher={dict.localeSwitcher} />

      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            {h.hero.badge}
          </div>
          <h1 className="font-headline mb-6 max-w-4xl text-5xl font-extrabold tracking-tighter text-on-surface md:text-7xl">
            {h.hero.titleBefore}{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent">
              {h.hero.titleHighlight}
            </span>{" "}
            {h.hero.titleAfter}
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">{h.hero.body}</p>
          <div id="download" className="mb-20">
            <CheckoutDownloadButtons labels={dict.checkoutButtons} locale={locale} />
          </div>

          <div className="relative mx-auto w-full max-w-4xl">
            <div className="absolute inset-0 -z-10 rounded-full bg-indigo-500/20 blur-[100px]" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b23] shadow-2xl">
              <Image
                src="/DevOracle - Dashboard.webp"
                alt={h.hero.dashboardImageAlt}
                width={2131}
                height={2172}
                className="h-auto w-full"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      </section>


      <section id="features" className="relative overflow-hidden bg-surface-container-low px-6 py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[min(100vw,56rem)] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[100px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-200">
              <span className="material-symbols-outlined text-base text-indigo-300" aria-hidden>
                auto_awesome
              </span>
              {h.features.eyebrow}
            </div>
            <h2 className="font-headline mb-5 text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
              {h.features.title}
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant md:text-xl">{h.features.subtitle}</p>
          </div>

          <div className="mb-14 flex flex-wrap items-center justify-center gap-x-1 gap-y-3 text-sm font-semibold md:gap-x-2">
            {h.features.pipelineSteps.map((label: string, i: number) => (
              <Fragment key={label}>
                {i > 0 && (
                  <span className="mx-1 select-none text-indigo-400/40 md:mx-2" aria-hidden>
                    →
                  </span>
                )}
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-on-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
                  {label}
                </span>
              </Fragment>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {h.features.cards.map((card: { icon: string; title: string; body: string }) => (
              <div
                key={card.title}
                className="group relative flex flex-col rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/35 hover:shadow-[0_28px_56px_-24px_rgba(79,70,229,0.35)] md:p-7"
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 55%, rgba(99,102,241,0.06) 100%)",
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/[0.15] text-indigo-200 ring-1 ring-indigo-400/25 transition-all duration-300 group-hover:bg-indigo-500/25 group-hover:ring-indigo-300/40">
                    <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                  </div>
                  <h3 className="font-headline mb-3 text-lg font-bold leading-snug tracking-tight text-on-surface">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{card.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              href={`${home}#pricing`}
              className="group inline-flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-8 py-3.5 text-base font-bold text-indigo-100 transition-all hover:border-indigo-300/50 hover:bg-indigo-500/25 hover:shadow-[0_0_28px_rgba(99,102,241,0.25)]"
            >
              {h.features.cta}
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-0.5">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-headline mb-20 text-center text-4xl font-bold tracking-tight">{h.howItWorks.title}</h2>
          <div className="grid gap-12 md:grid-cols-4">
            {h.howItWorks.steps.map((step: { n: string; t: string; d: string }) => (
              <div key={step.n} className="relative">
                <span className="absolute -left-4 -top-10 z-0 text-8xl font-black text-indigo-500/10">{step.n}</span>
                <div className="relative z-10">
                  <h4 className="font-headline mb-3 text-xl font-bold text-indigo-400">{step.t}</h4>
                  <p className="text-sm text-on-surface-variant">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-2xl border-l-4 border-indigo-500 bg-surface-container md:flex-row">
          <div className="p-12 md:w-1/2">
            <h2 className="font-headline mb-6 text-4xl font-bold tracking-tight">{h.stealth.title}</h2>
            <p className="mb-8 text-lg leading-relaxed text-on-surface-variant">{h.stealth.body}</p>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="material-symbols-outlined text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                security
              </span>
              {h.stealth.privacy}
            </div>
          </div>
          <div className="flex gap-4 bg-surface-container-highest p-8 md:w-1/2">
            <div className="flex-1 space-y-2">
              <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {h.stealth.theySee}
              </p>
              <div className="flex aspect-square items-center justify-center rounded-xl border border-white/5 bg-[#0d0d16] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full rounded-lg object-cover opacity-80"
                  alt={h.stealth.callAlt}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPJUmdwyashmNorACXord2ItAb8V9LNIYofboq7Q8Xg7uHRxzLndBoZm7aEr2JkiKfQC69BDRYy7L5j9zkzoP3SLsh15x7mRltT1gJM8UxnEsi8aKLL0TTQD6cgCBjJYn_rjOc2AIwmTYKUcSwj7N5PJlCp4MOvqQXHG7bebM9lBQ1Kmejx3GFSt7ghf7xBODZtZFdS4xPExAKITBP_4wW5Kpa66ksGNcnjOxPlH10Uia6A5RvJ5bzFMh8h-NltHKYlMx9_MFWUj0"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                {h.stealth.youSee}
              </p>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-indigo-500/30 bg-[#0d0d16] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full rounded-lg object-cover opacity-40 blur-[2px]"
                  alt={h.stealth.overlayAlt}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxZjR5ZqngOYe9vtrXSSFEUHrdcIOX_hd7dSGyfH3xkee1fb7R5m_aotxbWcB0l5naZ7zrBY_yTqhfELhzOK_VpZcaQd9aZ_gnjoFVZzeqjiDEOu_lrPT1I8_eoejTxWnuMDlkUadup96kGN8R_v533Ce7ZgftnOkj_70hPePsIbxVVtny06GIrN1p26wziXUsnAw2EOn0ZO4S843D73BMrbTM2fRTpd5r037P4XrNblXwOvOWFYNhL-2V3EN7KmY6lGmFY3ky7w"
                />
                <div className="absolute inset-4 flex flex-col gap-2 rounded-lg border border-indigo-500/20 p-3">
                  <div className="h-2 w-full rounded bg-indigo-500/40" />
                  <div className="h-2 w-3/4 rounded bg-indigo-500/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-headline mb-4 text-4xl font-bold tracking-tight">{h.knowledge.title}</h2>
            <p className="text-on-surface-variant">{h.knowledge.subtitle}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-surface-container shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-6">
              <span className="text-sm font-bold">{h.knowledge.bankTitle}</span>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {h.knowledge.hitLabel}
                  </p>
                  <p className="font-mono text-sm text-indigo-400">{h.knowledge.hitValue}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {h.knowledge.latencyLabel}
                  </p>
                  <p className="font-mono text-sm text-indigo-400">{h.knowledge.latencyValue}</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-4 p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>{h.knowledge.colQuestion}</span>
                <span>{h.knowledge.colMode}</span>
                <span>{h.knowledge.colAsked}</span>
                <span>{h.knowledge.colLastSeen}</span>
              </div>
              <div className="grid grid-cols-4 items-center p-4 text-xs transition-colors hover:bg-white/[0.02]">
                <span className="font-semibold text-on-surface">{h.knowledge.row1q}</span>
                <span>
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-300">{h.knowledge.modeInterview}</span>
                </span>
                <span className="text-on-surface-variant">{h.knowledge.row1asked}</span>
                <span className="text-on-surface-variant">{h.knowledge.row1seen}</span>
              </div>
              <div className="grid grid-cols-4 items-center p-4 text-xs transition-colors hover:bg-white/[0.02]">
                <span className="font-semibold text-on-surface">{h.knowledge.row2q}</span>
                <span>
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-300">{h.knowledge.modeInterview}</span>
                </span>
                <span className="text-on-surface-variant">{h.knowledge.row2asked}</span>
                <span className="text-on-surface-variant">{h.knowledge.row2seen}</span>
              </div>
              <div className="grid grid-cols-4 items-center p-4 text-xs transition-colors hover:bg-white/[0.02]">
                <span className="font-semibold text-on-surface">{h.knowledge.row3q}</span>
                <span>
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-300">{h.knowledge.modeInterview}</span>
                </span>
                <span className="text-on-surface-variant">{h.knowledge.row3asked}</span>
                <span className="text-on-surface-variant">{h.knowledge.row3seen}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-12 text-xs font-semibold text-on-surface-variant">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-indigo-400">savings</span>
              {h.knowledge.metricCache}
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-indigo-400">bolt</span>
              {h.knowledge.metricLatency}
            </span>
          </div>
        </div>
      </section>

      <HomePricingSection locale={locale} pricing={dict.pricing} checkout={dict.checkoutButtons} />

      <section className="bg-surface-container-low px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-headline mb-16 text-center text-4xl font-bold tracking-tight">{dict.faq.title}</h2>
          <div className="space-y-4">
            {dict.faq.items.map((item: { q: string; a: string }) => (
              <details key={item.q} className="group overflow-hidden rounded-xl border border-white/5 bg-surface-container">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  {item.q}
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed text-on-surface-variant">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 text-center">
        <div className="absolute inset-0 -z-10 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="mx-auto max-w-4xl">
          <h2 className="font-headline mb-8 text-5xl font-extrabold tracking-tighter md:text-6xl">{f.ctaTitle}</h2>
          <p className="mb-12 text-xl text-on-surface-variant">{f.ctaBody}</p>
          <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={`${home}#pricing`}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.45)]"
            >
              {f.ctaPrimary}
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
          </div>
          <p className="mb-6 text-sm text-on-surface-variant">{f.ctaDownloadHint}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={macUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-on-primary transition-all hover:shadow-[0_0_20px_rgba(192,193,255,0.4)]"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                ios
              </span>
              {f.downloadMac}
            </a>
            <a
              href={winUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-on-surface transition-colors hover:bg-white/10"
            >
              <span className="material-symbols-outlined">window</span>
              {f.downloadWin}
            </a>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-white/5 bg-[#13131b] pb-10 pt-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Image
              src="/logo-DEVORACLE.svg"
              alt={dict.meta.siteName}
              width={200}
              height={46}
              className="mb-4 h-8 w-auto"
            />
            <p className="text-sm leading-relaxed text-[#c7c4d7]">{f.tagline}</p>
          </div>
          <div>
            <h5 className="mb-6 text-xs font-bold uppercase tracking-widest text-indigo-400">{f.product}</h5>
            <ul className="space-y-4 text-sm text-[#c7c4d7]">
              <li>
                <a className="transition-colors hover:text-white" href={`${home}#features`}>
                  {dict.nav.features}
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-white" href={`${home}#pricing`}>
                  {dict.nav.pricing}
                </a>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" href={withLocale("/contact", locale)}>
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl border-t border-white/5 px-6 pt-8 md:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-x-6">
            <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
              <p>{f.copyright}</p>
              <span className="hidden text-on-surface-variant/30 sm:inline" aria-hidden>
                ·
              </span>
              <p>{f.vat}</p>
            </div>
            <nav
              className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 sm:shrink-0"
              aria-label={f.legal}
            >
              <Link
                href={withLocale("/privacy", locale)}
                className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 transition-colors hover:text-indigo-300"
              >
                {f.privacy}
              </Link>
              <span className="text-on-surface-variant/30" aria-hidden>
                ·
              </span>
              <Link
                href={withLocale("/terms", locale)}
                className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 transition-colors hover:text-indigo-300"
              >
                {f.terms}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
