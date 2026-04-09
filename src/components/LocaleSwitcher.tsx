"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Messages } from "@/lib/dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n-config";
import { stripLocaleFromPathname, withLocale } from "@/lib/i18n-path";

const LABEL: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
  pt: "Português (BR)",
  ru: "Русский",
};

type LocaleSwitcherProps = {
  locale: Locale;
  switcher: Messages["localeSwitcher"];
};

export function LocaleSwitcher({ locale, switcher }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathWithout = stripLocaleFromPathname(pathname);

  function onChange(next: string) {
    if (!isLocale(next)) return;
    router.push(withLocale(pathWithout, next));
  }

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{switcher.label}</span>
      <span className="material-symbols-outlined text-base text-on-surface-variant" aria-hidden>
        language
      </span>
      <select
        aria-label={switcher.current}
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-surface-container-lowest px-2 py-1.5 text-xs font-semibold text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {LABEL[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}
