export const CONTACT_TOPICS = [
  { id: "general", label: "General inquiry" },
  { id: "billing", label: "Billing & subscriptions" },
  { id: "technical", label: "Technical support" },
  { id: "partnership", label: "Partnership or press" },
  { id: "privacy", label: "Privacy & data protection" },
  { id: "other", label: "Other" },
] as const;

export type ContactTopicId = (typeof CONTACT_TOPICS)[number]["id"];

const TOPIC_IDS = new Set(CONTACT_TOPICS.map((t) => t.id));

export function isContactTopicId(value: string): value is ContactTopicId {
  return TOPIC_IDS.has(value as ContactTopicId);
}

export function getContactTopicLabel(id: string): string {
  return CONTACT_TOPICS.find((t) => t.id === id)?.label ?? id;
}
