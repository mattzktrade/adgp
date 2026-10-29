import { createFileRoute } from "@tanstack/react-router";

import { fulfillCheckoutSession, isAdgpSession, isPermanentFulfillmentFailure, refundAndAlert, releaseCheckoutSession } from "@/lib/stripe-webhook";

async function handleStripeWebhook(request: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret || !apiKey) {
    return new Response(JSON.stringify({ error: "Stripe webhook is not configured" }), { status: 503 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(apiKey);
  const signature = request.headers.get("stripe-signature") ?? "";
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("[stripe webhook] signature failed", message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (!isAdgpSession(session)) return new Response(JSON.stringify({ ok: true, ignored: true }), { status: 200 });
      const result = await fulfillCheckoutSession(session);
      if (!result.ok) {
        console.error("[stripe webhook] commit failed", result.message);
        if (isPermanentFulfillmentFailure(result.message) || result.retryable === false) {
          await refundAndAlert({ stripe, session, reason: result.message || "CRM commit failed after payment" });
          return new Response(JSON.stringify({ ok: true, refunded: true }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: result.message }), { status: 500 });
      }
    }
    if ((event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") && isAdgpSession(event.data.object)) {
      await releaseCheckoutSession(event.data.object);
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("[stripe webhook]", message);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => handleStripeWebhook(request),
    },
  },
});
