import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { isLocale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import { notFound } from "next/navigation";
import { LoginForm } from "./LoginForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.login.title,
    description: dict.meta.login.description,
    alternates: buildLocaleAlternates(withLocale("/login", locale)),
    robots: { index: false, follow: false },
  };
}

function LoginFallback({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 text-sm text-on-surface-variant">
      {message}
    </div>
  );
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <Suspense fallback={<LoginFallback message={dict.login.loading} />}>
      <LoginForm locale={locale} login={dict.login} />
    </Suspense>
  );
}
