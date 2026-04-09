import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n-config";
import { DashboardShell } from "../dashboard-shell";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardSecurityLayout({ children, params }: LayoutProps) {
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

  const passwordComplete = user.user_metadata?.password_set === true;

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email ?? "" }}
      passwordComplete={passwordComplete}
      locale={locale}
      shell={dict.dashboard.shell}
    >
      {children}
    </DashboardShell>
  );
}
