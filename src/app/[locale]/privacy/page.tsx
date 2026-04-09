import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
    alternates: buildLocaleAlternates(withLocale("/privacy", locale)),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation locale={locale} nav={dict.nav} switcher={dict.localeSwitcher} />
      <LegalDocument locale={locale} doc={dict.privacy} backLabel={dict.contact.back} />
    </>
  );
}
