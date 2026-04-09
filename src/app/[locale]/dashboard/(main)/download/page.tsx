import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";
import { DashboardDownload } from "../../dashboard-download";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardDownloadPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <DashboardDownload dashboard={dict.dashboard} />;
}
