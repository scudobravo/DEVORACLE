"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import { useState } from "react";
import { startCheckout, type CheckoutPlan } from "@/lib/start-checkout";

type HomePricingSectionProps = {
  locale: Locale;
  pricing: Messages["pricing"];
  checkout: Messages["checkoutButtons"];
};

export function HomePricingSection({ locale, pricing, checkout }: HomePricingSectionProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<CheckoutPlan | null>(null);

  async function handlePurchase(plan: CheckoutPlan) {
    setLoading(plan);
    setError(null);
    try {
      await startCheckout(plan, { locale });
    } catch (e) {
      const message = e instanceof Error ? e.message : checkout.errorFallback;
      setError(message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-headline mb-6 text-4xl font-bold tracking-tight">{pricing.title}</h2>
          <p className="mx-auto max-w-2xl text-on-surface-variant">{pricing.subtitle}</p>
        </div>

        {error ? (
          <p className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-slate-400/30 bg-surface-container p-8">
            <div className="mb-4 inline-flex w-fit rounded-full border border-slate-400/30 bg-slate-500/10 px-3 py-1 text-[11px] font-semibold text-slate-200">
              {pricing.passEyebrow}
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{pricing.passName}</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">€9.90</span>
              <span className="text-sm text-on-surface-variant">{pricing.passPriceNote}</span>
            </div>
            <ul className="mb-10 flex-1 space-y-4 text-sm text-on-surface-variant">
              {pricing.passFeatures.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="material-symbols-outlined text-lg text-indigo-400">check</span>
                  {line}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={loading !== null}
              onClick={() => handlePurchase("interview_pass")}
              className="mt-auto w-full rounded-xl border border-slate-400/40 bg-slate-500/10 py-3 text-center font-bold text-slate-100 transition-all hover:bg-slate-500/20 disabled:opacity-50"
            >
              {loading === "interview_pass" ? checkout.opening : pricing.passCta}
            </button>
          </div>

          <div className="relative flex scale-105 flex-col rounded-2xl border-2 border-indigo-500 bg-surface-container-high p-8 shadow-[0_0_40px_rgba(99,102,241,0.35)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {pricing.proBadge}
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-300">{pricing.proName}</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">€17</span>
              <span className="text-sm text-on-surface-variant">{pricing.proMonthly}</span>
            </div>
            <ul className="mb-10 flex-1 space-y-4 text-sm">
              {pricing.proFeatures.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="material-symbols-outlined text-lg text-indigo-400">check</span>
                  {line}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={loading !== null}
              onClick={() => handlePurchase("pro")}
              className="mt-auto w-full rounded-xl bg-indigo-500 py-3 text-center font-bold text-white transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:opacity-50"
            >
              {loading === "pro" ? checkout.opening : pricing.proCta}
            </button>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-on-surface-variant">{pricing.footerNote}</p>
      </div>
    </section>
  );
}
