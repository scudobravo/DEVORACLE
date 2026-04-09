export const locales = ["en", "de", "it", "es", "pt", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP 47 / hreflang values for alternate links (pt → pt-BR per GEO). */
export const localeToHreflang: Record<Locale, string> = {
  en: "en",
  de: "de",
  it: "it",
  es: "es",
  pt: "pt-BR",
  ru: "ru",
};

/** <html lang="…"> — Portuguese path `pt` maps to pt-BR. */
export const localeToHtmlLang: Record<Locale, string> = {
  en: "en",
  de: "de",
  it: "it",
  es: "es",
  pt: "pt-BR",
  ru: "ru",
};

/** Open Graph locale tags */
export const localeToOgLocale: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  it: "it_IT",
  es: "es_ES",
  pt: "pt_BR",
  ru: "ru_RU",
};

/** `Intl` / `toLocaleDateString` */
export const localeToDateLocale: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
  pt: "pt-BR",
  ru: "ru-RU",
};
