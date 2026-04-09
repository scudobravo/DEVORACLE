"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n-config";
import type { ProfileRow } from "@/types/profile";

export type DashboardUser = { id: string; email: string };

function parseUsage(json: unknown): { used: number; limit: number } {
  if (!json || typeof json !== "object") return { used: 0, limit: 0 };
  const o = json as Record<string, unknown>;
  const used = Number(o.tokens_used ?? o.used ?? 0);
  const limit = Number(o.tokens_limit ?? o.limit ?? 0);
  return {
    used: Number.isFinite(used) ? used : 0,
    limit: Number.isFinite(limit) ? limit : 0,
  };
}

type DashboardContextValue = {
  user: DashboardUser;
  profile: ProfileRow | null;
  setProfile: (p: ProfileRow | null) => void;
  usageUsed: number;
  usageLimit: number;
  sessionsCount: number | null;
  renewsAt: number | null;
  loadError: string | null;
  setLoadError: (e: string | null) => void;
  portalLoading: boolean;
  openPortal: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export function DashboardProvider({
  user,
  initialProfile,
  children,
}: {
  user: DashboardUser;
  initialProfile: ProfileRow | null;
  children: ReactNode;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<ProfileRow | null>(initialProfile);
  const [usageUsed, setUsageUsed] = useState(initialProfile?.tokens_used ?? 0);
  const [usageLimit, setUsageLimit] = useState(initialProfile?.tokens_limit ?? 0);
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);
  const [renewsAt, setRenewsAt] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setProfile(data);
      if (data.tokens_used != null) setUsageUsed(data.tokens_used);
      if (data.tokens_limit != null) setUsageLimit(data.tokens_limit);
    }
  }, [supabase, user.id]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadError(null);
      const baseLimit = profile?.tokens_limit ?? initialProfile?.tokens_limit ?? 150_000;
      const baseUsed = profile?.tokens_used ?? initialProfile?.tokens_used ?? 0;
      if (!cancelled) {
        setUsageLimit(baseLimit);
        setUsageUsed(baseUsed);
      }

      const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (backend && session?.access_token) {
        try {
          const uRes = await fetch(`${backend}/api/usage`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (uRes.ok) {
            const j = await uRes.json();
            const { used, limit } = parseUsage(j);
            if (!cancelled) {
              setUsageUsed(used);
              if (limit > 0) setUsageLimit(limit);
            }
          }
        } catch {
          /* profile as fallback */
        }
      }

      try {
        const sRes = await fetch("/api/sessions");
        if (sRes.ok) {
          const sJson = (await sRes.json()) as { count?: number };
          if (!cancelled) setSessionsCount(typeof sJson.count === "number" ? sJson.count : 0);
        } else if (!cancelled) setSessionsCount(0);
      } catch {
        if (!cancelled) setSessionsCount(0);
      }

      try {
        const bRes = await fetch("/api/billing/renewal");
        if (bRes.ok) {
          const bJson = (await bRes.json()) as { renewsAt?: number | null };
          if (!cancelled) setRenewsAt(bJson.renewsAt ?? null);
        }
      } catch {
        /* ignore */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [
    supabase,
    profile?.tokens_limit,
    profile?.tokens_used,
    profile?.stripe_subscription_id,
    initialProfile?.tokens_limit,
    initialProfile?.tokens_used,
  ]);

  const openPortal = useCallback(async () => {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = (await res.json()) as { url?: string; error?: string };
    setPortalLoading(false);
    if (!res.ok) {
      setLoadError(data.error ?? "Unable to open billing portal");
      return;
    }
    if (data.url) window.location.href = data.url;
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      setProfile,
      usageUsed,
      usageLimit,
      sessionsCount,
      renewsAt,
      loadError,
      setLoadError,
      portalLoading,
      openPortal,
      refreshProfile,
    }),
    [
      user,
      profile,
      usageUsed,
      usageLimit,
      sessionsCount,
      renewsAt,
      loadError,
      portalLoading,
      refreshProfile,
      openPortal,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function CheckoutSuccessHandler({ success, locale }: { success: boolean; locale: Locale }) {
  const router = useRouter();
  const { user, setProfile, refreshProfile } = useDashboard();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!success) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!cancelled && data) setProfile(data);
      await refreshProfile();
      if (!cancelled) router.replace(`/${locale}/dashboard`);
    })();
    return () => {
      cancelled = true;
    };
  }, [success, router, supabase, user.id, setProfile, refreshProfile, locale]);

  return null;
}
