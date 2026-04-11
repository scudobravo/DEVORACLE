import type Stripe from "stripe";
import {
  CreateIssuedDocumentRequest,
  Currency,
  Entity,
  IssuedDocument,
  IssuedDocumentEiData,
  IssuedDocumentItemsListItem,
  IssuedDocumentPaymentsListItem,
  IssuedDocumentStatus,
  IssuedDocumentType,
  Language,
  VatKind,
} from "@fattureincloud/fattureincloud-ts-sdk";
import { getStripe } from "@/lib/stripe";
import {
  getFicCompanyId,
  getFicDefaultEiCode,
  getFicEiPaymentMethod,
  getFicPaymentAccountId,
  isFicConfigured,
} from "./config";
import { createFicApis } from "./client";
import { claimStripeEventForFic, recordFicDocumentId } from "./idempotency";
import { resolveVatTypeId } from "./vat-resolve";

const PRODUCT_MARK = "DevOracle";

function centsToEuro(cents: number): number {
  return Math.round(cents) / 100;
}

function isoDateFromUnix(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function planLabel(plan: string | undefined): string {
  if (plan === "pro") return "DevOracle Pro (abbonamento)";
  if (plan === "interview_pass") return "DevOracle Interview Pass";
  return "DevOracle";
}

function shouldEmitFromSubscriptionMetadata(meta: Stripe.Metadata | null): boolean {
  return meta?.product === PRODUCT_MARK;
}

function buildEntityFromStripe(opts: {
  name: string;
  email?: string | null;
  countryIso?: string | null;
  line1?: string | null;
  city?: string | null;
  postal?: string | null;
  state?: string | null;
  vatNumber?: string | null;
}): Entity {
  const countryIso = opts.countryIso?.toUpperCase() ?? "";
  return {
    name: opts.name || opts.email || "Cliente",
    email: opts.email ?? undefined,
    country_iso: countryIso || undefined,
    address_street: opts.line1 ?? undefined,
    address_city: opts.city ?? undefined,
    address_postal_code: opts.postal ?? undefined,
    address_province: opts.state ?? undefined,
    vat_number: opts.vatNumber ?? undefined,
  };
}

export async function emitFicFromCheckoutSession(
  stripeEventId: string,
  sessionId: string,
): Promise<void> {
  if (!isFicConfigured()) return;

  const ok = await claimStripeEventForFic(stripeEventId, "checkout.session.completed", sessionId);
  if (!ok) return;

  const companyId = getFicCompanyId()!;
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product", "customer"],
  });

  if (session.metadata?.product !== PRODUCT_MARK) return;

  const plan = session.metadata?.plan ?? undefined;
  const totalCentsEarly = session.amount_total ?? 0;
  if (totalCentsEarly <= 0) return;

  const customerDetails = session.customer_details;
  const addr = customerDetails?.address;
  const country = addr?.country ?? undefined;
  const name = customerDetails?.name ?? session.customer_email ?? "Cliente";
  const email = customerDetails?.email ?? session.customer_email ?? undefined;

  let vatFromStripe: string | undefined;
  const taxIds = customerDetails?.tax_ids;
  if (taxIds?.length) {
    const tid =
      taxIds.find((t) => (t.type as string) === "eu_vat") ??
      taxIds.find((t) => (t.type as string).endsWith("_vat")) ??
      taxIds[0];
    vatFromStripe = tid?.value?.replace(/\s/g, "");
  }

  let entity = buildEntityFromStripe({
    name,
    email,
    countryIso: country,
    line1: addr?.line1,
    city: addr?.city,
    postal: addr?.postal_code,
    state: addr?.state,
    vatNumber: vatFromStripe,
  });

  const totalCents = totalCentsEarly;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const subtotalCents = Math.max(0, totalCents - taxCents);

  const { issuedDocuments, info } = createFicApis();
  const vatId = await resolveVatTypeId(info, companyId, {
    countryIso: country,
    taxCents,
    subtotalCents,
  });

  const items: IssuedDocumentItemsListItem[] = [];
  const lines = session.line_items?.data ?? [];
  if (lines.length > 0) {
    for (const li of lines) {
      const desc =
        typeof li.price?.product === "object" &&
        li.price?.product &&
        !("deleted" in li.price.product && li.price.product.deleted)
          ? (li.price.product as Stripe.Product).name
          : planLabel(plan);
      const qty = li.quantity ?? 1;
      const lineGross = li.amount_total ?? li.amount_subtotal ?? 0;
      items.push({
        name: desc,
        qty,
        gross_price: centsToEuro(lineGross) / qty,
        vat: { id: vatId },
      });
    }
  } else {
    items.push({
      name: planLabel(plan),
      qty: 1,
      gross_price: centsToEuro(totalCents),
      vat: { id: vatId },
    });
  }

  const eInvoice = country === "IT";
  const eiData: IssuedDocumentEiData | undefined = eInvoice
    ? {
        vat_kind: VatKind.I,
        payment_method: getFicEiPaymentMethod(),
      }
    : undefined;

  if (eInvoice) {
    entity = { ...entity, e_invoice: true, ei_code: getFicDefaultEiCode() };
  }

  const currency: Currency = { id: session.currency?.toUpperCase() ?? "EUR" };
  const language: Language = { code: "it", name: "Italiano" };

  const docDate =
    session.created != null ? isoDateFromUnix(session.created) : new Date().toISOString().slice(0, 10);

  const payments: IssuedDocumentPaymentsListItem[] = [];
  const payAcc = getFicPaymentAccountId();
  if (payAcc != null) {
    payments.push({
      amount: centsToEuro(totalCents),
      status: IssuedDocumentStatus.Paid,
      paid_date: docDate,
      due_date: docDate,
      payment_account: { id: payAcc },
    });
  }

  const issued: IssuedDocument = {
    type: IssuedDocumentType.Invoice,
    entity,
    date: docDate,
    currency,
    language,
    subject: `Ordine Stripe ${session.id}`,
    visible_subject: planLabel(plan),
    notes: `Stripe Checkout Session: ${session.id}`,
    items_list: items,
    payments_list: payments.length ? payments : undefined,
    e_invoice: eInvoice,
    ei_data: eiData,
    use_gross_prices: true,
  };

  const req: CreateIssuedDocumentRequest = { data: issued };
  const created = await issuedDocuments.createIssuedDocument(companyId, req);
  const ficId = created.data.data?.id;
  if (typeof ficId === "number") {
    await recordFicDocumentId(stripeEventId, ficId);
  }
}

export async function emitFicFromStripeInvoice(stripeEventId: string, invoiceId: string): Promise<void> {
  if (!isFicConfigured()) return;

  const ok = await claimStripeEventForFic(stripeEventId, "invoice.paid", invoiceId);
  if (!ok) return;

  const companyId = getFicCompanyId()!;
  const stripe = getStripe();
  /** Stripe v22 tipizza Invoice in modo minimale; usiamo campi runtime documentati nell'API. */
  type InvoicePayload = Stripe.Invoice &
    Record<string, unknown> & {
      subscription?: string | Stripe.Subscription | null;
    };

  const rawInvoice = (await stripe.invoices.retrieve(invoiceId, {
    expand: ["lines.data.price.product", "subscription", "customer"],
  })) as unknown;
  const invoice = (
    rawInvoice &&
    typeof rawInvoice === "object" &&
    "data" in rawInvoice &&
    (rawInvoice as { data: unknown }).data
      ? (rawInvoice as { data: InvoicePayload }).data
      : rawInvoice
  ) as InvoicePayload;

  const sub = invoice.subscription;
  const subObj =
    typeof sub === "string" ? await stripe.subscriptions.retrieve(sub) : sub && "metadata" in sub ? sub : null;

  if (!subObj || !shouldEmitFromSubscriptionMetadata(subObj.metadata)) return;

  if (((invoice.amount_paid as number | undefined) ?? 0) <= 0) return;

  const plan = subObj.metadata?.plan ?? "pro";
  const addr = invoice.customer_address;
  const country = addr?.country ?? undefined;
  const name = invoice.customer_name ?? invoice.customer_email ?? "Cliente";
  const email = invoice.customer_email ?? undefined;

  let vatNumber: string | undefined;
  const custId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (custId) {
    const c = await stripe.customers.retrieve(custId, { expand: ["tax_ids.data"] });
    if (!c.deleted && "tax_ids" in c && c.tax_ids?.data?.length) {
      const t =
        c.tax_ids.data.find((x) => x.type === "eu_vat") ??
        c.tax_ids.data.find((x) => (x.type as string).endsWith("_vat")) ??
        c.tax_ids.data[0];
      vatNumber = t?.value?.replace(/\s/g, "");
    }
  }

  let entity = buildEntityFromStripe({
    name,
    email,
    countryIso: country,
    line1: addr?.line1,
    city: addr?.city,
    postal: addr?.postal_code,
    state: addr?.state,
    vatNumber,
  });

  const totalCents = (invoice.amount_paid as number | undefined) ?? 0;
  const taxCents = (invoice.tax as number | undefined) ?? 0;
  const subEx = invoice.subtotal_excluding_tax as number | undefined | null;
  const subtotalCents =
    subEx != null ? subEx : ((invoice.subtotal as number | undefined) ?? Math.max(0, totalCents - taxCents));

  const { issuedDocuments, info } = createFicApis();
  const vatId = await resolveVatTypeId(info, companyId, {
    countryIso: country,
    taxCents,
    subtotalCents,
  });

  const items: IssuedDocumentItemsListItem[] = [
    {
      name: planLabel(plan),
      qty: 1,
      gross_price: centsToEuro(totalCents),
      vat: { id: vatId },
    },
  ];

  const eInvoice = country === "IT";
  const eiData: IssuedDocumentEiData | undefined = eInvoice
    ? {
        vat_kind: VatKind.I,
        payment_method: getFicEiPaymentMethod(),
      }
    : undefined;

  if (eInvoice) {
    entity = { ...entity, e_invoice: true, ei_code: getFicDefaultEiCode() };
  }

  const currency: Currency = { id: (invoice.currency ?? "eur").toUpperCase() };
  const language: Language = { code: "it", name: "Italiano" };
  const periodEnd = invoice.status_transitions?.paid_at ?? invoice.created;
  const docDate = periodEnd != null ? isoDateFromUnix(periodEnd) : new Date().toISOString().slice(0, 10);

  const payments: IssuedDocumentPaymentsListItem[] = [];
  const payAcc = getFicPaymentAccountId();
  if (payAcc != null) {
    payments.push({
      amount: centsToEuro(totalCents),
      status: IssuedDocumentStatus.Paid,
      paid_date: docDate,
      due_date: docDate,
      payment_account: { id: payAcc },
    });
  }

  const issued: IssuedDocument = {
    type: IssuedDocumentType.Invoice,
    entity,
    date: docDate,
    currency,
    language,
    subject: `Abbonamento Stripe ${invoice.id}`,
    visible_subject: planLabel(plan),
    notes: `Stripe Invoice: ${invoice.id} — Subscription: ${subObj.id}`,
    items_list: items,
    payments_list: payments.length ? payments : undefined,
    e_invoice: eInvoice,
    ei_data: eiData,
    use_gross_prices: true,
  };

  const req: CreateIssuedDocumentRequest = { data: issued };
  const created = await issuedDocuments.createIssuedDocument(companyId, req);
  const ficId = created.data.data?.id;
  if (typeof ficId === "number") {
    await recordFicDocumentId(stripeEventId, ficId);
  }
}
