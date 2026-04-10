<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Sitemap</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 1.5rem; color: #111; }
          h1 { font-size: 1.25rem; }
          table { border-collapse: collapse; width: 100%; max-width: 960px; }
          th, td { border: 1px solid #ccc; padding: 0.4rem 0.5rem; text-align: left; vertical-align: top; }
          th { background: #f4f4f4; }
          .loc { word-break: break-all; font-size: 0.85rem; }
          .meta { font-size: 0.8rem; color: #444; }
          caption { caption-side: bottom; text-align: left; font-size: 0.8rem; color: #666; margin-top: 0.5rem; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p class="meta">Anteprima leggibile nel browser. I crawler usano il sorgente XML.</p>
        <table>
          <caption><xsl:value-of select="count(s:urlset/s:url)"/> URL</caption>
          <thead>
            <tr>
              <th>URL</th>
              <th>Frequenza</th>
              <th>Priorità</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td class="loc"><xsl:value-of select="s:loc"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:value-of select="s:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
