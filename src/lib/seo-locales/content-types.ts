export type LongFormSection = {
  heading: string;
  paragraphs: string[];
};

export type LongFormPage = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  relatedKeywords: string[];
  faq: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
  sections: LongFormSection[];
};
