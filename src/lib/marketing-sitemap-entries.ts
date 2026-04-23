import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n-config";
import { buildHreflangLanguageUrls } from "@/lib/hreflang-alternates";
import { getSiteUrl } from "@/lib/site-url";
import { withLocale } from "@/lib/i18n-path";

const marketingPaths = [
  "/",
  "/ai-tools",
  "/ai-tools/devoracle-interview-copilot",
  "/guides",
  "/guides/best-ai-tools-for-technical-interviews",
  "/guides/how-to-use-devoracle",
  "/guides/devoracle-alternatives",
  "/guides/devoracle-vs-chatgpt",
  "/guides/interview-prep-playbook-2026",
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
        priority: path === "/" ? 1 : path === "/ai-tools" || path === "/guides" ? 0.9 : 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
