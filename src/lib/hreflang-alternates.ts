import type { Metadata } from "next";
import { defaultLocale, localeToHreflang, locales } from "./i18n-config";
import { getSiteUrl } from "./site-url";
import { stripLocaleFromPathname, withLocale } from "./i18n-path";

/**
 * Mappa hreflang (BCP 47) → URL assoluto per un path interno senza segmento lingua
 * (es. `/`, `/contact`). Include `x-default` sulla variante inglese.
 */
export function buildHreflangLanguageUrls(pathWithoutLocale: string): Record<string, string> {
  const base = getSiteUrl();
  const normalized =
    pathWithoutLocale === "" || pathWithoutLocale === "/"
      ? "/"
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
  const languages: Record<string, string> = {};

  for (const loc of locales) {
    languages[localeToHreflang[loc]] = `${base}${withLocale(normalized, loc)}`;
  }
  languages["x-default"] = `${base}${withLocale(normalized, defaultLocale)}`;

  return languages;
}

/** Costruisce `alternates.canonical` + `languages` (hreflang) per un path localizzato. */
export function buildLocaleAlternates(pathnameWithLocale: string): Metadata["alternates"] {
  const base = getSiteUrl();
  const pathWithoutLocale = stripLocaleFromPathname(pathnameWithLocale);
  const languages = buildHreflangLanguageUrls(pathWithoutLocale);

  return {
    canonical: `${base}${pathnameWithLocale}`,
    languages,
  };
}
