import Link from "next/link";
import type { LongFormPage } from "@/lib/seo-content";
import type { SeoLongFormChrome } from "@/lib/seo-locales/types";
import type { Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { getSiteUrl } from "@/lib/site-url";

type LongFormPageProps = {
  page: LongFormPage;
  locale: Locale;
  sectionLabel: string;
  pathname: string;
  chrome: SeoLongFormChrome;
};

export function LongFormPageView({ page, locale, sectionLabel, pathname, chrome }: LongFormPageProps) {
  const canonicalUrl = `${getSiteUrl()}${withLocale(pathname, locale)}`;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: canonicalUrl,
    about: [page.keyword, ...page.relatedKeywords],
  };

  return (
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-28 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">{sectionLabel}</p>
      <h1 className="font-headline mb-5 text-4xl font-extrabold tracking-tight md:text-5xl">{page.title}</h1>
      <p className="mb-10 text-lg leading-relaxed text-on-surface-variant">{page.description}</p>

      <section className="mb-10 rounded-2xl border border-white/10 bg-surface-container p-6">
        <h2 className="mb-4 text-2xl font-bold">{chrome.searchIntent}</h2>
        <p className="mb-3 text-on-surface-variant">
          <strong className="text-on-surface">{chrome.primaryKeyword}</strong> {page.keyword}
        </p>
        <p className="text-on-surface-variant">
          <strong className="text-on-surface">{chrome.relatedKeywords}</strong> {page.relatedKeywords.join(", ")}
        </p>
      </section>

      <div className="space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-headline mb-4 text-3xl font-bold tracking-tight">{section.heading}</h2>
            <div className="space-y-4 text-base leading-8 text-on-surface-variant">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-headline mb-4 text-3xl font-bold tracking-tight">{chrome.faq}</h2>
        <div className="space-y-4">
          {page.faq.map((item) => (
            <details key={item.question} className="rounded-xl border border-white/10 bg-surface-container p-5">
              <summary className="cursor-pointer font-semibold text-on-surface">{item.question}</summary>
              <p className="mt-3 leading-7 text-on-surface-variant">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <h2 className="font-headline mb-4 text-2xl font-bold tracking-tight">{chrome.relatedContent}</h2>
        <ul className="space-y-3">
          {page.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link className="font-semibold text-indigo-300 hover:text-indigo-200" href={withLocale(link.href, locale)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
