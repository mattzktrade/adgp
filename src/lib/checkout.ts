import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { crmAdgpFetch, isCrmCatalogConfigured, isWebsiteCheckoutEnabled, type CrmHold, type CrmOrderLookup } from "@/lib/crm-client";
import { dayOptionsFor, getPackage } from "@/lib/packages";
import { SITE_URL } from "@/lib/site";

const checkoutInput = z.object({
  slug: z.string().trim().min(1).max(80),
  day: z.string().trim().min(1).max(40),
  fullName: z.string().trim().min(1).max(180),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(8).max(40),
  guests: z.number().int().min(1).max(200),
});

function stripeSecret(): string {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export function checkoutReady(): boolean {
  return isWebsiteCheckoutEnabled() && isCrmCatalogConfigured() && Boolean(stripeSecret());
}

async function createStripeSession(input: {
  hold: CrmHold;
  slug: string;
  day: string;
  fullName: string;
  email: string;
  phone: string;
  guests: number;
}): Promise<{ ok: true; url: string; sessionId: string } | { ok: false; message: string }> {
  const secret = stripeSecret();
  if (!secret) return { ok: false, message: "Checkout is not configured yet." };
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(secret);
  const expiresAt = Math.max(Math.floor(Date.now() / 1000) + 30 * 60, Math.floor(Date.parse(input.hold.expiresAt) / 1000) || 0);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/checkout/cancel?slug=${encodeURIComponent(input.slug)}`,
    customer_email: input.email,
    phone_number_collection: { enabled: true },
    billing_address_collection: "required",
    expires_at: expiresAt,
    line_items: [
      {
        quantity: input.guests,
        price_data: {
          currency: input.hold.currency.toLowerCase(),
          unit_amount: Math.round(input.hold.unitPrice * 100),
          product_data: {
            name: `${input.hold.packageName} — Abu Dhabi GP 2026`,
            description: input.day,
          },
        },
      },
    ],
    metadata: {
      holdId: input.hold.holdId,
      packageId: input.hold.packageId,
      slug: input.slug,
      day: input.day,
      guests: String(input.guests),
      unitPrice: String(input.hold.unitPrice),
      currency: input.hold.currency,
      fullName: input.fullName,
      phone: input.phone,
    },
  });
  if (!session.url || !session.id) return { ok: false, message: "Stripe did not return a checkout URL." };
  return { ok: true, url: session.url, sessionId: session.id };
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator(checkoutInput)
  .handler(async ({ data }) => {
    if (!checkoutReady()) {
      return { ok: false as const, message: "Online checkout is not available yet. Contact us and we will place this for you." };
    }
    const pkg = getPackage(data.slug);
    if (!pkg) return { ok: false as const, message: "That package is not available." };
    if (pkg.slug === "paddock-club") {
      return { ok: false as const, message: "Paddock Club is sold through our team. Contact us and we will confirm what is left." };
    }
    if (!dayOptionsFor(pkg.slug).includes(data.day)) {
      return { ok: false as const, message: "Choose one of the available days." };
    }

    let holdResponse: Response;
    try {
      holdResponse = await crmAdgpFetch("/holds", {
        method: "POST",
        body: JSON.stringify({ slug: data.slug, day: data.day, guests: data.guests }),
      });
    } catch (error) {
      console.error("[checkout] hold failed", error);
      return { ok: false as const, message: "We couldn't reserve those seats just now. Please try again in a moment." };
    }
    if (!holdResponse.ok) {
      const detail = await holdResponse.text().catch(() => "");
      console.error("[checkout] CRM rejected hold", holdResponse.status, detail.slice(0, 400));
      if (holdResponse.status === 409) {
        return { ok: false as const, message: "Those seats are no longer available. Try fewer guests or another day." };
      }
      return { ok: false as const, message: "We couldn't reserve those seats just now. Please try again in a moment." };
    }
    const holdBody = (await holdResponse.json()) as { hold?: CrmHold };
    const hold = holdBody.hold;
    if (!hold?.holdId) return { ok: false as const, message: "We couldn't reserve those seats just now." };

    try {
      const session = await createStripeSession({
        hold,
        slug: data.slug,
        day: data.day,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        guests: data.guests,
      });
      if (!session.ok) {
        await crmAdgpFetch("/holds/release", {
          method: "POST",
          body: JSON.stringify({ holdId: hold.holdId }),
        }).catch(() => undefined);
        return session;
      }
      await crmAdgpFetch("/holds", {
        method: "POST",
        body: JSON.stringify({ holdId: hold.holdId, stripeSessionId: session.sessionId }),
      }).catch((error) => console.error("[checkout] attach session failed", error));
      return { ok: true as const, url: session.url };
    } catch (error) {
      console.error("[checkout] stripe session failed", error);
      await crmAdgpFetch("/holds/release", {
        method: "POST",
        body: JSON.stringify({ holdId: hold.holdId }),
      }).catch(() => undefined);
      return { ok: false as const, message: "We couldn't start card payment just now. Please try again in a moment." };
    }
  });

export const lookupCheckoutOrder = createServerFn({ method: "GET" })
  .validator(z.object({ sessionId: z.string().trim().min(1).max(200) }))
  .handler(async ({ data }) => {
    if (!isCrmCatalogConfigured()) return { ok: true as const, pending: true };
    try {
      const response = await crmAdgpFetch(`/orders?stripeSessionId=${encodeURIComponent(data.sessionId)}`);
      if (!response.ok) return { ok: true as const, pending: true };
      const body = (await response.json()) as CrmOrderLookup;
      return { ok: true as const, ...body };
    } catch (error) {
      console.error("[checkout] lookup failed", error);
      return { ok: true as const, pending: true };
    }
  });
