import { NextResponse } from "next/server";
import { getMarketingSitemapEntries } from "@/lib/marketing-sitemap-entries";
import { serializeSitemapXml } from "@/lib/serialize-sitemap-xml";

export async function GET() {
  const entries = getMarketingSitemapEntries();
  const xml = serializeSitemapXml(entries, { stylesheetHref: "/sitemap.xsl" });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
