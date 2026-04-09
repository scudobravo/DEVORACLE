"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import { localeToDateLocale } from "@/lib/i18n-config";
import { useDashboard } from "./dashboard-context";
import {
  formatTokensShort,
  planBadgeClass,
  planLabel,
  progressTone,
} from "./dashboard-ui";

type DashboardOverviewProps = {
  dashboard: Messages["dashboard"];
  locale: Locale;
};

export function DashboardOverview({ dashboard: d, locale }: DashboardOverviewProps) {
  const {
    profile,
    usageUsed,
    usageLimit,
    sessionsCount,
    renewsAt,
    loadError,
  } = useDashboard();

  const dateLocale = localeToDateLocale[locale];

  const effectiveLimit =
    usageLimit > 0 ? usageLimit : profile?.tokens_limit ?? 150_000;
  const effectiveUsed = Number.isFinite(usageUsed) ? usageUsed : profile?.tokens_used ?? 0;
  const pct =
    effectiveLimit > 0 ? Math.min(100, Math.round((effectiveUsed / effectiveLimit) * 100)) : 0;

  const resetLabel = profile?.usage_reset_at
    ? new Date(profile.usage_reset_at).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : d.overview.dash;

  const renewLabel = renewsAt
    ? new Date(renewsAt).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : d.overview.dash;

  const tokensLine = d.overview.tokensLine
    .replace("{used}", formatTokensShort(effectiveUsed))
    .replace("{limit}", formatTokensShort(effectiveLimit))
    .replace("{reset}", resetLabel);

  return (
    <>
      {loadError ? (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {loadError}
        </p>
      ) : null}
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{d.overview.title}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-surface-container p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {d.overview.activePlan}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{planLabel(d.plans, profile?.plan)}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${planBadgeClass(profile?.plan)}`}>
                {profile?.subscription_status ?? "inactive"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface-container p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {d.overview.nextRenewal}
            </p>
            <p className="text-2xl font-bold">{renewLabel}</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {renewsAt ? d.overview.renewalHintActive : d.overview.renewalHintInactive}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface-container p-6 md:col-span-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {d.overview.tokensTitle}
            </p>
            <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all ${progressTone(pct)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-sm text-on-surface-variant">{tokensLine}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface-container p-6 md:col-span-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {d.overview.sessionsTitle}
            </p>
            <p className="text-3xl font-bold">{sessionsCount ?? d.overview.dash}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{d.overview.sessionsHint}</p>
          </div>
        </div>
      </div>
    </>
  );
}
