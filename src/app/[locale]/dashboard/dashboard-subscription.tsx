"use client";

import type { Messages } from "@/lib/dictionary";
import Link from "next/link";
import { useDashboard } from "./dashboard-context";
import { planLabel } from "./dashboard-ui";

type DashboardSubscriptionProps = {
  dashboard: Messages["dashboard"];
  locale: string;
};

export function DashboardSubscription({ dashboard: d, locale }: DashboardSubscriptionProps) {
  const { profile, loadError, portalLoading, openPortal } = useDashboard();

  const plan = (profile?.plan ?? "free").toLowerCase();
  const isPaid = plan === "pro";
  const priceLabel =
    plan === "pro" ? d.subscription.pricePro : plan === "interview_pass" ? d.subscription.pricePass : d.subscription.priceNone;

  return (
    <>
      {loadError ? (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {loadError}
        </p>
      ) : null}
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{d.subscription.title}</h1>
        <div className="rounded-2xl border border-white/10 bg-surface-container p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {d.subscription.currentPlan}
          </p>
          <p className="text-2xl font-bold">
            {planLabel(d.plans, profile?.plan)} · {priceLabel}
          </p>
          <p className="mt-2 text-sm text-on-surface-variant">
            {d.subscription.status}: {profile?.subscription_status ?? "—"}
          </p>
          {isPaid && profile?.stripe_customer_id ? (
            <button
              type="button"
              disabled={portalLoading}
              onClick={() => void openPortal()}
              className="mt-6 rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] disabled:opacity-50"
            >
              {portalLoading ? d.subscription.opening : d.subscription.manage}
            </button>
          ) : null}
          {!isPaid ? (
            <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
              <p className="mb-4 font-semibold text-indigo-100">{d.subscription.upsell}</p>
              <Link
                href={`/${locale}#pricing`}
                className="inline-flex rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-400"
              >
                {d.subscription.viewPricing}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
