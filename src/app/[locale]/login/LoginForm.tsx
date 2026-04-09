"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getPublicOrigin(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin.replace(/\/$/, "");
  return "";
}

type LoginFormProps = {
  locale: Locale;
  login: Messages["login"];
};

export function LoginForm({ locale, login }: LoginFormProps) {
  const searchParams = useSearchParams();
  const defaultNext = withLocale("/dashboard", locale);
  const nextPath = searchParams.get("next") || defaultNext;
  const urlError = searchParams.get("error");

  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "auth_callback" ? login.errors.authCallback : null,
  );
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const origin = getPublicOrigin();
    if (!origin) {
      setError(login.errors.siteUrl);
      return;
    }

    const dest =
      nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : defaultNext;
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(dest)}`;

    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo,
        shouldCreateUser: false,
      },
    });
    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setInfo(login.info);
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="grain-overlay" aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-surface-container p-8 shadow-2xl">
        <h1 className="font-headline mb-2 text-2xl font-bold tracking-tight">{login.title}</h1>
        <p className="mb-8 text-sm text-on-surface-variant">{login.subtitle}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
            >
              {login.email}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none ring-indigo-500/0 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          {info ? (
            <p className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-100">
              {info}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 py-3 font-bold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] disabled:opacity-50"
          >
            {loading ? login.sending : login.submit}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {login.needAccess}{" "}
          <Link
            href={`${withLocale("/", locale)}#pricing`}
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {login.viewPlans}
          </Link>
        </p>
      </div>
    </div>
  );
}
