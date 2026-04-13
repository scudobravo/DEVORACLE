import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n-config";
import { buildHreflangLanguageUrls } from "@/lib/hreflang-alternates";
import { getSiteUrl } from "@/lib/site-url";
import { withLocale } from "@/lib/i18n-path";

const marketingPaths = [
  "/",
  "/contact",
  "/download",
  "/privacy",
  "/terms",
] as const;

function localizedUrl(path: (typeof marketingPaths)[number], locale: Locale): string {
  const base = getSiteUrl();
  return `${base}${withLocale(path, locale)}`;
}

export function getMarketingSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of marketingPaths) {
    const languages = buildHreflangLanguageUrls(path);

    for (const locale of locales) {
      entries.push({
        url: localizedUrl(path, locale),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : path === "/privacy" || path === "/terms" ? 0.5 : 0.7,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
