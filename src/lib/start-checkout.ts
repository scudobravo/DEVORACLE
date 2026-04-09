import type { Locale } from "@/lib/i18n-config";

export type CheckoutPlan = "pro" | "interview_pass";

export async function startCheckout(
  plan: CheckoutPlan,
  opts?: { email?: string; locale?: Locale },
) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan,
      ...(opts?.email ? { email: opts.email } : {}),
      ...(opts?.locale ? { locale: opts.locale } : {}),
    }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (data.error || !data.url) throw new Error(data.error ?? "Checkout failed");
  window.location.href = data.url;
}
