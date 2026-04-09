import type { Messages } from "@/lib/dictionary";
import Link from "next/link";
import type { Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";

type LegalDoc = Messages["privacy"] | Messages["terms"];

type LegalDocumentProps = {
  locale: Locale;
  doc: LegalDoc;
  backLabel: string;
};

export function LegalDocument({ locale, doc, backLabel }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 md:pt-32">
      <h1 className="font-headline mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">{doc.title}</h1>
      <p className="mb-10 text-sm text-on-surface-variant">
        {doc.lastUpdatedLabel}: {doc.lastUpdated}
      </p>
      <p className="mb-12 leading-relaxed text-on-surface-variant">{doc.intro}</p>
      <div className="space-y-12">
        {doc.sections.map((section, i) => (
          <section key={i} className="scroll-mt-24">
            <h2 className="font-headline mb-4 text-xl font-bold tracking-tight text-on-surface">{section.heading}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant md:text-base">
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-16 text-center text-sm text-on-surface-variant">
        <Link href={withLocale("/", locale)} className="font-semibold text-indigo-400 hover:text-indigo-300">
          {backLabel}
        </Link>
      </p>
    </article>
  );
}
