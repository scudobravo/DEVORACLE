import type { InfoApi, VatType } from "@fattureincloud/fattureincloud-ts-sdk";
import { getFicVatIdItaly, getFicVatIdZero } from "./config";

function isDisabled(v: VatType): boolean {
  return v.is_disabled === true;
}

/** Sceglie un tipo IVA FIC in base a paese e aliquota stimata da Stripe (centesimi di euro). */
export async function resolveVatTypeId(
  info: InfoApi,
  companyId: number,
  opts: { countryIso?: string | null; taxCents?: number | null; subtotalCents?: number | null },
): Promise<number> {
  const it = opts.countryIso?.toUpperCase() === "IT";
  const tax = opts.taxCents ?? 0;
  const zeroOverride = getFicVatIdZero();
  const italyOverride = getFicVatIdItaly();

  if (!it) {
    if (zeroOverride != null) return zeroOverride;
    return pickVatFromList(info, companyId, { mode: "non_it" });
  }

  if (tax <= 0) {
    if (zeroOverride != null) return zeroOverride;
    return pickVatFromList(info, companyId, { mode: "it_zero_tax" });
  }

  if (italyOverride != null) return italyOverride;
  return pickVatFromList(info, companyId, { mode: "it_taxed", taxCents: tax, subtotalCents: opts.subtotalCents ?? 0 });
}

async function pickVatFromList(
  info: InfoApi,
  companyId: number,
  opts:
    | { mode: "non_it" }
    | { mode: "it_zero_tax" }
    | { mode: "it_taxed"; taxCents: number; subtotalCents: number },
): Promise<number> {
  const res = await info.listVatTypes(companyId);
  const list = (res.data.data ?? []).filter((v) => v.id != null && !isDisabled(v)) as Array<
    VatType & { id: number }
  >;

  if (list.length === 0) {
    throw new Error("Fatture in Cloud: nessun tipo IVA disponibile");
  }

  if (opts.mode === "non_it") {
    const zero = list.find((v) => v.value === 0);
    if (zero?.id != null) return zero.id;
    return list[0].id;
  }

  if (opts.mode === "it_zero_tax") {
    const zeroIt = list.find(
      (v) =>
        v.value === 0 &&
        (v.description?.toLowerCase().includes("esent") ||
          v.description?.toLowerCase().includes("non impon") ||
          v.description?.toLowerCase().includes("art")),
    );
    if (zeroIt?.id != null) return zeroIt.id;
    const anyZero = list.find((v) => v.value === 0);
    if (anyZero?.id != null) return anyZero.id;
    return list[0].id;
  }

  const sub = opts.subtotalCents ?? 0;
  const impliedRate = sub > 0 ? (opts.taxCents / sub) * 100 : 22;
  const target = impliedRate >= 18 ? 22 : impliedRate >= 8 ? 10 : impliedRate >= 3 ? 5 : 22;

  const closest = list
    .filter((v) => typeof v.value === "number" && v.value! > 0)
    .sort((a, b) => Math.abs((a.value ?? 0) - target) - Math.abs((b.value ?? 0) - target))[0];

  if (closest?.id != null) return closest.id;

  const fallback22 = list.find((v) => v.value === 22);
  if (fallback22?.id != null) return fallback22.id;

  return list[0].id;
}
