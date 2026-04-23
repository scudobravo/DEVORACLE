import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { notFound } from "next/navigation";
import { DownloadPageContent } from "./DownloadPageContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.download.title,
    description: dict.meta.download.description,
    alternates: buildLocaleAlternates(withLocale("/download", locale)),
    robots: { index: false, follow: true },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <DownloadPageContent locale={locale} download={dict.download} />;
}
