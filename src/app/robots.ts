import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n-config";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const dashboardDisallows = locales.map((locale) => `/${locale}/dashboard`);
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...dashboardDisallows, "/api/", "/auth/"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
