import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";
import { DashboardSubscription } from "../../dashboard-subscription";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardSubscriptionPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <DashboardSubscription dashboard={dict.dashboard} locale={locale} />;
}
