import type { Messages } from "@/lib/dictionary";
export function avatarLetter(email: string) {
  const t = email.trim();
  return t ? t.charAt(0).toUpperCase() : "?";
}

export function planLabel(plans: Messages["dashboard"]["plans"], plan: string | null | undefined) {
  const p = (plan ?? "free").toLowerCase();
  if (p === "pro") return plans.pro;
  if (p === "interview_pass") return plans.interviewPass;
  if (p === "team") return plans.team;
  return plans.none;
}

export function planBadgeClass(plan: string | null | undefined) {
  const p = (plan ?? "free").toLowerCase();
  if (p === "pro") return "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40";
  if (p === "team") return "bg-violet-500/20 text-violet-100 ring-1 ring-violet-500/40";
  return "bg-white/10 text-on-surface-variant ring-1 ring-white/10";
}

export function progressTone(pct: number) {
  if (pct < 70) return "bg-emerald-500";
  if (pct < 90) return "bg-amber-400";
  return "bg-red-500";
}

export function formatTokensShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`.replace(".0M", "M");
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(Math.round(n));
}
