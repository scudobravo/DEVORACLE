import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n-config";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const dashboardDisallows = locales.map((locale) => `/${locale}/dashboard`);
  const authDisallows = locales.flatMap((locale) => [`/${locale}/login`, `/${locale}/signup`, `/${locale}/welcome`]);
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...dashboardDisallows, ...authDisallows, "/api/", "/auth/", "/*?*"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
