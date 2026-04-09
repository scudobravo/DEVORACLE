"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

type NavigationProps = {
  locale: Locale;
  nav: Messages["nav"];
  switcher: Messages["localeSwitcher"];
};

export function Navigation({ locale, nav, switcher }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const home = withLocale("/", locale);

  const links = [
    { href: `${home}#features`, label: nav.features },
    { href: `${home}#how-it-works`, label: nav.howItWorks },
    { href: `${home}#pricing`, label: nav.pricing },
    { href: withLocale("/contact", locale), label: nav.contact },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#13131b]/80 shadow-[0px_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href={home} className="flex shrink-0 items-center" aria-label={nav.homeAria}>
          <Image
            src="/logo-DEVORACLE.svg"
            alt="Devoracle"
            width={220}
            height={51}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-semibold uppercase tracking-wider text-[#c7c4d7] transition-colors duration-300 hover:text-indigo-300"
            >
              {l.label}
            </Link>
          ))}
          <LocaleSwitcher locale={locale} switcher={switcher} />
          <Link
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95"
            href={`${home}#pricing`}
          >
            {nav.viewPlans}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher locale={locale} switcher={switcher} />
          <button
            type="button"
            className="text-on-surface"
            aria-expanded={open}
            aria-label={open ? nav.closeMenu : nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[#13131b]/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold uppercase tracking-wider text-[#c7c4d7] transition-colors hover:text-indigo-300"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={`${home}#pricing`}
              className="rounded-lg bg-primary py-3 text-center text-sm font-bold text-on-primary"
              onClick={() => setOpen(false)}
            >
              {nav.viewPlans}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
