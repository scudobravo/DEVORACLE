"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import { useState } from "react";
import { startCheckout, type CheckoutPlan } from "@/lib/start-checkout";

type CheckoutDownloadButtonsProps = {
  plan?: CheckoutPlan;
  className?: string;
  labels: Messages["checkoutButtons"];
  locale: Locale;
};

export function CheckoutDownloadButtons({
  plan = "interview_pass",
  className = "",
  labels,
  locale,
}: CheckoutDownloadButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      await startCheckout(plan, { locale });
    } catch (e) {
      setError(e instanceof Error ? e.message : labels.errorFallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      {error ? (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          disabled={loading}
          onClick={go}
          className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-primary to-primary-container px-8 py-4 font-bold text-on-primary-container transition-all hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            ios
          </span>
          {loading ? labels.opening : labels.downloadMac}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={go}
          className="flex items-center justify-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-4 font-bold text-on-surface transition-colors hover:bg-white/5 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">window</span>
          {loading ? labels.opening : labels.downloadWin}
        </button>
      </div>
    </div>
  );
}
