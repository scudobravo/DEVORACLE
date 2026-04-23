import type { Locale } from "@/lib/i18n-config";
import type { SeoBundle } from "./types";
import { buildGuidePages } from "./types";
import { deUi } from "./de-ui";
import { esUi } from "./es-ui";
import { seoBundleEn } from "./en";
import { itUi } from "./it-ui";
import { ptUi } from "./pt-ui";
import { ruUi } from "./ru-ui";

function mergeUi(
  base: SeoBundle,
  ui: Pick<SeoBundle, "meta" | "index" | "common">,
): SeoBundle {
  return {
    ...base,
    meta: ui.meta,
    index: ui.index,
    common: ui.common,
  };
}

const bundles: Record<Locale, SeoBundle> = {
  en: seoBundleEn,
  it: mergeUi(seoBundleEn, itUi),
  de: mergeUi(seoBundleEn, deUi),
  es: mergeUi(seoBundleEn, esUi),
  pt: mergeUi(seoBundleEn, ptUi),
  ru: mergeUi(seoBundleEn, ruUi),
};

export function getSeoBundle(locale: Locale): SeoBundle {
  return bundles[locale] ?? seoBundleEn;
}

export { buildGuidePages };
