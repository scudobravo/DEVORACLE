import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json({ renewsAt: null as number | null });
  }

  try {
    const stripe = getStripe();
    const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
    const end = (sub as unknown as { current_period_end?: number }).current_period_end;
    return NextResponse.json({ renewsAt: typeof end === "number" ? end * 1000 : null });
  } catch {
    return NextResponse.json({ renewsAt: null as number | null });
  }
}
