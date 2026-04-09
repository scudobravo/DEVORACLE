import type { Messages } from "@/lib/dictionary";
import { getSiteUrl } from "./site-url";

export function getSoftwareApplicationJsonLd(dict: Messages) {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: dict.meta.siteName,
    applicationCategory: "EducationalApplication",
    operatingSystem: "macOS, Windows",
    offers: [
      {
        "@type": "Offer",
        price: "9.90",
        priceCurrency: "EUR",
        name: dict.schema.offerPassName,
        description: dict.schema.offerPassDescription,
      },
      {
        "@type": "Offer",
        price: "17",
        priceCurrency: "EUR",
        billingIncrement: "month",
        name: dict.schema.offerProName,
        description: dict.schema.offerProDescription,
      },
    ],
    description: dict.schema.softwareDescription,
    url: baseUrl,
    screenshot: `${baseUrl}/screenshot.png`,
  };
}

export function getOrganizationJsonLd(dict: Messages) {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.meta.siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "support@devoracle.com",
        contactType: "customer support",
      },
      {
        "@type": "ContactPoint",
        email: "sales@devoracle.com",
        contactType: "sales",
      },
    ],
  };
}

export function getHowToJsonLd(dict: Messages) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: dict.schema.howToName,
    description: dict.schema.howToDescription,
    step: dict.schema.howToSteps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  };
}

export function getFaqPageJsonLd(dict: Messages) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
