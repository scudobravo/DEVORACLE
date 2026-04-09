import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n-config";
import { SecurityPasswordForm } from "./SecurityPasswordForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardSecurityPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard/security`);
  }

  const needsPassword = user.user_metadata?.password_set !== true;

  return (
    <SecurityPasswordForm
      needsPassword={needsPassword}
      email={user.email ?? ""}
      locale={locale}
      security={dict.dashboard.security}
    />
  );
}
