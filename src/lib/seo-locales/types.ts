import type { LongFormPage, LongFormSection } from "@/lib/seo-locales/content-types";

export type SeoIndexAiTools = {
  h1: string;
  intro: string;
  chooseTitle: string;
  chooseP1: string;
  chooseP2: string;
  openTool: string;
  relatedTitle: string;
  relatedBestAi: { href: string; label: string };
  relatedHowTo: { href: string; label: string };
  relatedPlaybook: { href: string; label: string };
};

export type SeoIndexGuides = {
  h1: string;
  intro: string;
  readGuide: string;
};

export type SeoLongFormChrome = {
  searchIntent: string;
  primaryKeyword: string;
  relatedKeywords: string;
  faq: string;
  relatedContent: string;
};

export type SeoCommon = {
  longForm: SeoLongFormChrome;
  section: { aiTools: string; guides: string };
  breadcrumbHome: string;
};

export type SeoMeta = {
  aiToolsIndex: { title: string; description: string; ogTitle: string; ogDescription: string };
  guidesIndex: { title: string; description: string; ogTitle: string; ogDescription: string };
};

export type SeoBundle = {
  meta: SeoMeta;
  index: { aiTools: SeoIndexAiTools; guides: SeoIndexGuides };
  common: SeoCommon;
  sharedHowTo: LongFormSection;
  guides: LongFormPage[];
  blogPosts: LongFormPage[];
  aiToolsPages: LongFormPage[];
};

export function buildGuidePages(bundle: SeoBundle): LongFormPage[] {
  return [...bundle.guides, ...bundle.blogPosts];
}
