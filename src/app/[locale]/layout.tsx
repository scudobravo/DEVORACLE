import type { Metadata } from "next";
import Script from "next/script";
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { notFound } from "next/navigation";
import {
  isLocale,
  type Locale,
  localeToHtmlLang,
  localeToOgLocale,
  locales,
} from "@/lib/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import { buildLocaleAlternates } from "@/lib/hreflang-alternates";
import { withLocale } from "@/lib/i18n-path";
import { getSiteUrl } from "@/lib/site-url";
import {
  getFaqPageJsonLd,
  getHowToJsonLd,
  getOrganizationJsonLd,
  getSoftwareApplicationJsonLd,
} from "@/lib/structured-data";
import { AutoBreadcrumbs } from "@/components/seo/AutoBreadcrumbs";
import { BreadcrumbLabelsProvider } from "@/components/seo/BreadcrumbLabelsContext";
import { buildGuidePages, getSeoBundle } from "@/lib/seo-locales";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
});

const GA_MEASUREMENT_ID = "G-JHW5NBGZ3D";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: loc } = await params;
  if (!isLocale(loc)) notFound();
  const dict = getDictionary(loc);
  const base = getSiteUrl();
  const localizedHome = withLocale("/", loc);
  const alternates = buildLocaleAlternates(localizedHome);
  const ogLocale = localeToOgLocale[loc];
  const alternateLocales = locales
    .filter((l) => l !== loc)
    .map((l) => localeToOgLocale[l]);

  return {
    metadataBase: new URL(base),
    title: { default: dict.meta.home.title, template: `%s | ${dict.meta.siteName}` },
    description: dict.meta.home.description,
    keywords: [...dict.meta.home.keywords],
    alternates,
    openGraph: {
      title: dict.meta.home.ogTitle,
      description: dict.meta.home.ogDescription,
      url: `${base}${localizedHome}`,
      siteName: dict.meta.siteName,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630 }],
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.twitterTitle,
      description: dict.meta.home.twitterDescription,
      images: [`${base}/og-image.png`],
    },
    robots: { index: true, follow: true },
    manifest: "/favicons/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicons/favicon.ico", sizes: "any" },
      ],
      apple: "/favicons/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: loc } = await params;
  if (!isLocale(loc)) notFound();

  const dict = getDictionary(loc);
  const locale = loc as Locale;
  const seo = getSeoBundle(locale);
  const bySegment: Record<string, string> = {
    "ai-tools": dict.nav.aiTools,
    guides: dict.nav.guides,
  };
  for (const p of [...buildGuidePages(seo), ...seo.aiToolsPages]) {
    const t = p.title;
    bySegment[p.slug] = t.length > 64 ? `${t.slice(0, 61)}…` : t;
  }
  const htmlLang = localeToHtmlLang[loc];
  const faqLd = getFaqPageJsonLd(dict);
  const softwareLd = getSoftwareApplicationJsonLd(dict);
  const orgLd = getOrganizationJsonLd(dict);
  const howToLd = getHowToJsonLd(dict);

  return (
    <html
      lang={htmlLang}
      className={`dark ${bricolage.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- icon font esterno */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
        {/* JSON-LD: tag <script> nativi (no next/script) per evitare errori di idratazione al cambio lingua (client navigation). */}
        <script
          id="ld-json-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <script
          id="ld-json-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
        />
        <script
          id="ld-json-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          id="ld-json-howto"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      </head>
      <body className="font-body text-on-surface overflow-x-hidden antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <BreadcrumbLabelsProvider
          value={{ home: seo.common.breadcrumbHome, bySegment }}
        >
          <AutoBreadcrumbs />
          {children}
        </BreadcrumbLabelsProvider>
      </body>
    </html>
  );
}
