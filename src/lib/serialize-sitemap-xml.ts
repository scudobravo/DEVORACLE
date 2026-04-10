import type { MetadataRoute } from "next";

function escapeXmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/'/g, "&apos;");
}

function escapeXmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Serializza il sitemap (url, hreflang, changefreq, priority) con opzione foglio XSL per anteprima nel browser.
 */
export function serializeSitemapXml(
  data: MetadataRoute.Sitemap,
  options?: { stylesheetHref?: string },
): string {
  const hasAlternates = data.some((item) => Object.keys(item.alternates ?? {}).length > 0);

  let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
  if (options?.stylesheetHref) {
    content += `<?xml-stylesheet type="text/xsl" href="${escapeXmlAttr(options.stylesheetHref)}"?>\n`;
  }

  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  if (hasAlternates) {
    content += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  } else {
    content += ">\n";
  }

  for (const item of data) {
    content += "<url>\n";
    content += `<loc>${escapeXmlText(item.url)}</loc>\n`;
    const languages = item.alternates?.languages;
    if (languages && Object.keys(languages).length) {
      for (const language in languages) {
        const href = languages[language as keyof typeof languages];
        if (href) {
          content += `<xhtml:link rel="alternate" hreflang="${escapeXmlAttr(language)}" href="${escapeXmlAttr(href)}" />\n`;
        }
      }
    }
    if (item.lastModified) {
      const serializedDate =
        item.lastModified instanceof Date ? item.lastModified.toISOString() : item.lastModified;
      content += `<lastmod>${escapeXmlText(String(serializedDate))}</lastmod>\n`;
    }
    if (item.changeFrequency) {
      content += `<changefreq>${item.changeFrequency}</changefreq>\n`;
    }
    if (typeof item.priority === "number") {
      content += `<priority>${item.priority}</priority>\n`;
    }
    content += "</url>\n";
  }

  content += "</urlset>\n";
  return content;
}
