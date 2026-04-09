"use client";

import type { Messages } from "@/lib/dictionary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getAppDisplayName } from "@/lib/download-env";
import { createClient } from "@/lib/supabase/client";

type SecurityPasswordFormProps = {
  needsPassword: boolean;
  email: string;
  locale: string;
  security: Messages["dashboard"]["security"];
};

export function SecurityPasswordForm({
  needsPassword,
  email,
  locale,
  security,
}: SecurityPasswordFormProps) {
  const appName = getAppDisplayName();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (newPassword.length < 8) {
      setError(security.errors.minLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(security.errors.mismatch);
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
      data: { password_set: true },
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setInfo(security.infoSaved);
    router.refresh();
    router.push(`/${locale}/download`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">{security.title}</h1>

      {needsPassword ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          {security.needsPassword.replace("{email}", email)}
        </div>
      ) : (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-100">
          {security.hasPassword}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-surface-container p-6">
        <p className="mb-6 text-sm text-on-surface-variant">{security.chooseStrong}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="sec-new-password"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
            >
              {security.newPassword}
            </label>
            <input
              id="sec-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label
              htmlFor="sec-confirm-password"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
            >
              {security.confirmPassword}
            </label>
            <input
              id="sec-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
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
            className="rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] disabled:opacity-50"
          >
            {loading
              ? security.saving
              : needsPassword
                ? security.saveContinue
                : security.updatePassword}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface-container/80 p-6 text-center">
        <p className="mb-4 text-sm text-on-surface-variant">{security.desktopReady}</p>
        <Link
          href={`/${locale}/download`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-4 text-base font-bold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] sm:w-auto sm:min-w-[280px]"
        >
          {security.downloadCta.replace("{appName}", appName)}
        </Link>
      </div>
    </div>
  );
}
