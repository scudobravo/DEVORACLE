import { HomeMarketingPage } from "@/components/home/HomeMarketingPage";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <HomeMarketingPage locale={locale} dict={dict} />;
}
