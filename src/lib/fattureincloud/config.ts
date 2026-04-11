/**
 * Variabili supportate:
 * - FIC_ACCESS_TOKEN | FATTUREINCLOUD_ACCESS_TOKEN
 * - FIC_COMPANY_ID | FATTUREINCLOUD_COMPANY_ID
 * - FIC_PAYMENT_ACCOUNT_ID | FATTUREINCLOUD_PAYMENT_ACCOUNT_ID
 * - FATTUREINCLOUD_VAT_ID — tipo IVA FIC per vendite IT tassate (es. 22%); 0 o assente = auto
 * - FATTUREINCLOUD_VAT_ID_ZERO — tipo IVA 0% (estero / esenti); es. 10
 * - FIC_VAT_ID_ITALY / FIC_VAT_ID_FOREIGN — alias opzionali
 */
export function getFicAccessToken(): string | undefined {
  return process.env.FIC_ACCESS_TOKEN ?? process.env.FATTUREINCLOUD_ACCESS_TOKEN;
}

export function getFicCompanyId(): number | undefined {
  const raw = process.env.FIC_COMPANY_ID ?? process.env.FATTUREINCLOUD_COMPANY_ID;
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function isFicConfigured(): boolean {
  return Boolean(getFicAccessToken() && getFicCompanyId());
}

/** Conto incasso in FIC (Stripe). Obbligatorio per segnare la fattura come pagata. */
export function getFicPaymentAccountId(): number | undefined {
  const raw = process.env.FIC_PAYMENT_ACCOUNT_ID ?? process.env.FATTUREINCLOUD_PAYMENT_ACCOUNT_ID;
  if (!raw?.trim()) return undefined;
  const n = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(n) ? n : undefined;
}

/** Codice destinatario SDI predefinito (es. 7 zeri per alcuni casi B2C). */
export function getFicDefaultEiCode(): string {
  return process.env.FIC_DEFAULT_EI_CODE?.trim() || "0000000";
}

/** Modalità pagamento fattura elettronica (es. MP08 carta). */
export function getFicEiPaymentMethod(): string {
  return process.env.FIC_EI_PAYMENT_METHOD?.trim() || "MP08";
}

/**
 * Tipo IVA per vendite in Italia con imposta > 0 (es. 22%).
 * FATTUREINCLOUD_VAT_ID=0 o assente → nessun override (si usa l’euristica da Stripe).
 */
export function getFicVatIdItaly(): number | undefined {
  const raw = process.env.FATTUREINCLOUD_VAT_ID ?? process.env.FIC_VAT_ID_ITALY;
  if (raw === undefined || String(raw).trim() === "") return undefined;
  const n = Number.parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

/**
 * Tipo IVA 0% (cliente estero, operazioni non imponibili, ecc.).
 * FATTUREINCLOUD_VAT_ID_ZERO=10 tipico in FIC.
 */
export function getFicVatIdZero(): number | undefined {
  const raw = process.env.FATTUREINCLOUD_VAT_ID_ZERO ?? process.env.FIC_VAT_ID_FOREIGN;
  if (raw === undefined || String(raw).trim() === "") return undefined;
  const n = Number.parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

/** @deprecated Usare getFicVatIdZero; mantenuto per compatibilità. */
export function getFicVatIdForeign(): number | undefined {
  return getFicVatIdZero();
}
