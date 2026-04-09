import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { notFound } from "next/navigation";
import { ContactForm } from "./ContactForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    alternates: buildLocaleAlternates(withLocale("/contact", locale)),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={locale} nav={dict.nav} switcher={dict.localeSwitcher} />
      <main className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pt-32">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">{dict.contact.kicker}</p>
        <h1 className="font-headline mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">{dict.contact.title}</h1>
        <p className="mb-10 text-on-surface-variant">{dict.contact.intro}</p>

        <div className="rounded-2xl border border-white/10 bg-surface-container p-6 md:p-8">
          <ContactForm labels={dict.contact} />
        </div>

        <p className="mt-10 text-center text-sm text-on-surface-variant">
          <Link href={withLocale("/", locale)} className="font-semibold text-indigo-400 hover:text-indigo-300">
            {dict.contact.back}
          </Link>
        </p>
      </main>
    </>
  );
}
