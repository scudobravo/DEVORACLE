import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n-config";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard`);
  }

  return <>{children}</>;
}
