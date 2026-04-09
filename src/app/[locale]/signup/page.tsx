import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/** Classic email+password signup is not exposed in this funnel. */
export default async function SignupPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}/login`);
}
