import type Stripe from "stripe";

import { crmAdgpFetch, type CrmOrderLookup } from "@/lib/crm-client";

export type FulfillCheckoutResult =
  | ({ ok: true } & Partial<CrmOrderLookup>)
  | { ok: false; message: string; retryable: boolean };

export function isPermanentFulfillmentFailure(message: string): boolean {
  return /insufficient_stock|leaves_one_remaining|hold_package_mismatch|hold_price_mismatch|hold_guests_mismatch|hold_currency_mismatch|package_not_found|package_enquiry_only|event_has_ended|client_email_required|client_name_required|missing CRM metadata/i.test(
    message,
  );
}

function metadata(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  return {
    holdId: meta.holdId ?? "",
    packageId: meta.packageId ?? "",
    slug: meta.slug ?? "",
    day: meta.day ?? "",
    guests: Number(meta.guests ?? 0),
    unitPrice: Number(meta.unitPrice ?? 0),
    currency: (meta.currency || session.currency || "usd").toUpperCase(),
    fullName: meta.fullName || session.customer_details?.name || "",
    email: session.customer_details?.email || session.customer_email || "",
    phone: meta.phone || session.customer_details?.phone || "",
  };
}

function billing(session: Stripe.Checkout.Session) {
  const address = session.customer_details?.address;
  return {
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    postcode: address?.postal_code ?? "",
    country: address?.country ?? "",
  };
}

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<FulfillCheckoutResult> {
  const meta = metadata(session);
  if (!meta.holdId || !meta.packageId || !session.id) {
    return { ok: false, message: "Checkout session is missing CRM metadata.", retryable: false };
  }
  const response = await crmAdgpFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      holdId: meta.holdId,
      stripeSessionId: session.id,
      packageId: meta.packageId,
      guests: meta.guests,
      unitPrice: meta.unitPrice,
      currency: meta.currency,
      buyer: {
        name: meta.fullName,
        email: meta.email,
        phone: meta.phone,
      },
      billing: billing(session),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const message = detail.slice(0, 400) || `CRM commit failed (${response.status})`;
    return { ok: false, message, retryable: response.status >= 500 || response.status === 409 || !isPermanentFulfillmentFailure(message) };
  }
  const body = (await response.json().catch(() => ({}))) as CrmOrderLookup & { orderReference?: string };
  return {
    ok: true,
    pending: false,
    orderId: body.orderId,
    orderReference: body.orderReference,
    dealReference: body.dealReference,
    packageName: body.packageName,
    guests: body.guests ?? meta.guests,
    totalAmount: body.totalAmount,
    currency: body.currency || meta.currency,
  };
}

export async function releaseCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  const holdId = session.metadata?.holdId ?? "";
  await crmAdgpFetch("/holds/release", {
    method: "POST",
    body: JSON.stringify({ holdId, stripeSessionId: session.id }),
  });
}

export async function refundAndAlert(input: {
  stripe: Stripe;
  session: Stripe.Checkout.Session;
  reason: string;
}): Promise<void> {
  const paymentIntent = typeof input.session.payment_intent === "string" ? input.session.payment_intent : input.session.payment_intent?.id;
  if (paymentIntent) {
    try {
      await input.stripe.refunds.create({ payment_intent: paymentIntent });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!/already been refunded|charge_already_refunded/i.test(message)) {
        throw error;
      }
    }
  }
  const meta = metadata(input.session);
  await crmAdgpFetch("/failures", {
    method: "POST",
    body: JSON.stringify({
      reason: input.reason,
      stripeSessionId: input.session.id,
      packageName: input.session.line_items?.data?.[0]?.description || meta.slug,
      guests: meta.guests,
      totalAmount: (input.session.amount_total ?? 0) / 100,
      currency: meta.currency,
      clientName: meta.fullName,
      clientEmail: meta.email,
      clientPhone: meta.phone,
    }),
  }).catch((error) => console.error("[stripe] failure alert failed", error));
}
