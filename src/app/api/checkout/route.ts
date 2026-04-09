import { NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n-config";
import { getStripe } from "@/lib/stripe";

type CheckoutPlan = "pro" | "interview_pass";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { plan?: CheckoutPlan; email?: string; locale?: string };
    const plan = body?.plan;
    const email = body?.email?.trim();
    const loc = body?.locale && isLocale(body.locale) ? body.locale : defaultLocale;

    if (!plan || (plan !== "pro" && plan !== "interview_pass")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = getBaseUrl();

    const proPriceId = process.env.STRIPE_PRICE_PRO;
    const interviewPassPriceId = process.env.STRIPE_PRICE_INTERVIEW_PASS;

    if (plan === "pro") {
      if (!proPriceId) {
        throw new Error("Missing STRIPE_PRICE_PRO");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email || undefined,
        line_items: [{ price: proPriceId, quantity: 1 }],
        metadata: {
          product: "DevOracle",
          plan: "pro",
        },
        success_url: `${baseUrl}/${loc}/welcome?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/${loc}/#pricing`,
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        tax_id_collection: { enabled: true },
      });

      return NextResponse.json({ url: session.url });
    }

    if (!interviewPassPriceId) {
      throw new Error("Missing STRIPE_PRICE_INTERVIEW_PASS");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: [{ price: interviewPassPriceId, quantity: 1 }],
      metadata: {
        product: "DevOracle",
        plan: "interview_pass",
      },
      success_url: `${baseUrl}/${loc}/welcome?session_id={CHECKOUT_SESSION_ID}&plan=pass`,
      cancel_url: `${baseUrl}/${loc}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      tax_id_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
