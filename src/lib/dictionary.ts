import "server-only";
import type { Locale } from "./i18n-config";
import { isLocale } from "./i18n-config";
import de from "@/messages/de";
import en from "@/messages/en";
import es from "@/messages/es";
import it from "@/messages/it";
import pt from "@/messages/pt";
import ru from "@/messages/ru";

import type { Messages } from "@/messages/en";

const catalogs: Record<Locale, Messages> = { en, de, it, es, pt, ru };

export type { Messages };

export function getDictionary(locale: string): Messages {
  return isLocale(locale) ? catalogs[locale] : catalogs.en;
}
