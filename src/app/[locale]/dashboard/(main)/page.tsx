import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";
import { CheckoutSuccessHandler } from "../dashboard-context";
import { DashboardOverview } from "../dashboard-overview";

type Search = { success?: string };

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Search>;
};

export default async function DashboardHomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = searchParams ? await searchParams : {};
  const checkoutSuccess = sp.success === "true";

  return (
    <>
      <CheckoutSuccessHandler success={checkoutSuccess} locale={locale} />
      <DashboardOverview dashboard={dict.dashboard} locale={locale} />
    </>
  );
}
