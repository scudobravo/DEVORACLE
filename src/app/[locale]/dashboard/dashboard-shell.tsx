"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DashboardUser } from "./dashboard-context";
import { avatarLetter } from "./dashboard-ui";

type NavItem = {
  href: string;
  label: string;
  match: "exact" | "prefix";
  disabled?: boolean;
};

type DashboardShellProps = {
  user: DashboardUser;
  passwordComplete: boolean;
  locale: Locale;
  shell: Messages["dashboard"]["shell"];
  children: ReactNode;
};

function NavRow({
  item,
  active,
  lockTooltip,
}: {
  item: NavItem;
  active: boolean;
  lockTooltip: string;
}) {
  const base =
    "rounded-lg px-3 py-2 text-left text-sm font-semibold transition text-on-surface-variant hover:bg-white/5 hover:text-on-surface";
  const activeCls = "bg-indigo-500/20 text-indigo-100";
  const disabledCls =
    "pointer-events-none cursor-not-allowed opacity-40 hover:bg-transparent hover:text-on-surface-variant";

  if (item.disabled) {
    return (
      <span title={lockTooltip} className={`${base} ${disabledCls}`}>
        {item.label}
      </span>
    );
  }

  return (
    <Link href={item.href} className={`block ${base} ${active ? activeCls : ""}`}>
      {item.label}
    </Link>
  );
}

function NavPill({
  item,
  active,
  lockTooltip,
}: {
  item: NavItem;
  active: boolean;
  lockTooltip: string;
}) {
  if (item.disabled) {
    return (
      <span
        title={lockTooltip}
        className="cursor-not-allowed rounded-full bg-white/5 px-3 py-1 text-xs font-bold opacity-40"
      >
        {item.label}
      </span>
    );
  }
  return (
    <Link
      href={item.href}
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-indigo-500 text-white" : "bg-white/10 text-on-surface-variant"
      }`}
    >
      {item.label}
    </Link>
  );
}

function pathActive(pathname: string, item: NavItem): boolean {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function DashboardShell({
  user,
  passwordComplete,
  locale,
  shell,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const prefix = `/${locale}/dashboard`;

  const mainLocked = !passwordComplete;

  const navItems: NavItem[] = mainLocked
    ? [
        { href: `${prefix}/security`, label: shell.security, match: "prefix", disabled: false },
        { href: prefix, label: shell.overview, match: "exact", disabled: true },
        { href: `${prefix}/subscription`, label: shell.subscription, match: "prefix", disabled: true },
        { href: `${prefix}/download`, label: shell.download, match: "prefix", disabled: true },
      ]
    : [
        { href: prefix, label: shell.overview, match: "exact" },
        { href: `${prefix}/subscription`, label: shell.subscription, match: "prefix" },
        { href: `${prefix}/download`, label: shell.download, match: "prefix" },
        { href: `${prefix}/security`, label: shell.security, match: "prefix" },
      ];

  async function logout() {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <div className="relative min-h-dvh bg-[#0f0f13] text-[#f0f0f5]">
      <div className="grain-overlay" aria-hidden />
      <div className="relative z-10 flex min-h-dvh">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#13131b] p-6 md:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-200">
              {avatarLetter(user.email)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-on-surface-variant">{shell.account}</p>
              <p className="truncate text-sm font-semibold">{user.email}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavRow
                key={item.href + (item.disabled ? "-d" : "")}
                item={item}
                active={pathActive(pathname, item)}
                lockTooltip={shell.lockTooltip}
              />
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-auto rounded-lg px-3 py-2 text-left text-sm font-semibold text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
          >
            {shell.logout}
          </button>
        </aside>

        <main className="flex-1 overflow-auto p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between gap-4 md:hidden">
            <p className="truncate text-sm font-semibold">{user.email}</p>
            <button
              type="button"
              onClick={() => void logout()}
              className="shrink-0 text-xs font-bold text-indigo-300"
            >
              {shell.signOut}
            </button>
          </div>
          <div className="mb-8 flex flex-wrap gap-2 md:hidden">
            {navItems.map((item) => (
              <NavPill
                key={item.href + (item.disabled ? "-m-d" : "-m")}
                item={item}
                active={pathActive(pathname, item)}
                lockTooltip={shell.lockTooltip}
              />
            ))}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
