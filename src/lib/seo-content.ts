export type { LongFormPage, LongFormSection } from "@/lib/seo-locales/content-types";

export type { SeoBundle } from "@/lib/seo-locales/types";
export { getSeoBundle, buildGuidePages } from "@/lib/seo-locales";

import type { Locale } from "@/lib/i18n-config";
import { defaultLocale } from "@/lib/i18n-config";
import { buildGuidePages, getSeoBundle } from "@/lib/seo-locales";

export function getGuidePagesForLocale(locale: Locale) {
  return buildGuidePages(getSeoBundle(locale));
}

export function getAiToolPagesForLocale(locale: Locale) {
  return getSeoBundle(locale).aiToolsPages;
}

const enBundle = getSeoBundle(defaultLocale);
export const guidePages = buildGuidePages(enBundle);
export const aiToolsPages = enBundle.aiToolsPages;
