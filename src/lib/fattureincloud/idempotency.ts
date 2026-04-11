import { createAdminClient } from "@/lib/supabase/admin";

/**
 * @returns true se questo evento può essere processato (prima volta), false se già registrato.
 */
export async function claimStripeEventForFic(
  stripeEventId: string,
  source: string,
  stripeRef: string,
): Promise<boolean> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "[fic] SUPABASE_SERVICE_ROLE_KEY mancante: idempotenza disattivata (retry Stripe può duplicare in FIC)",
    );
    return true;
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("fic_stripe_emissions").insert({
      stripe_event_id: stripeEventId,
      source,
      stripe_ref: stripeRef,
    });
    if (!error) return true;
    if (error.code === "23505" || error.message?.includes("duplicate")) {
      return false;
    }
    console.error("[fic] idempotency insert:", error.message);
    return true;
  } catch (e) {
    console.error("[fic] idempotency:", e);
    return true;
  }
}

export async function recordFicDocumentId(stripeEventId: string, ficDocumentId: number): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const admin = createAdminClient();
    await admin
      .from("fic_stripe_emissions")
      .update({ fic_document_id: ficDocumentId })
      .eq("stripe_event_id", stripeEventId);
  } catch {
    /* best-effort */
  }
}
