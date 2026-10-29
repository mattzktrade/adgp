import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buildAvailabilityLead } from "@/lib/crm-lead";
import { takeRateLimit } from "@/lib/rate-limit";

const availabilityInput = z.object({
  slug: z.string().trim().min(1).max(80),
  day: z.string().trim().min(1).max(40),
  fullName: z.string().trim().min(1).max(180),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(8).max(40),
  guests: z.number().int().min(1).max(200),
});

const CRM_LEAD_WEBHOOK_URL = "https://zk-sports.trade/api/webhooks/marketing-lead";

export const submitAvailabilityRequest = createServerFn({ method: "POST" })
  .validator(availabilityInput)
  .handler(async ({ data }) => {
    if (!takeRateLimit("enquiry", 5, 10 * 60_000)) {
      return { ok: false as const, message: "Too many requests. Please wait a few minutes, or email or WhatsApp us directly." };
    }
    const lead = buildAvailabilityLead({
      ...data,
      leadId: `adgp-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    });
    if (!lead.ok) return lead;

    const secret = process.env.CRM_LEAD_WEBHOOK_SECRET?.trim();
    const url = process.env.CRM_LEAD_WEBHOOK_URL?.trim() || CRM_LEAD_WEBHOOK_URL;
    if (!secret) {
      console.error("[availability] CRM_LEAD_WEBHOOK_SECRET is not set");
      return { ok: false as const, message: "We couldn't send that just now. Please try again in a moment." };
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-webhook-secret": secret,
        },
        body: JSON.stringify(lead.body),
      });
    } catch (error) {
      console.error("[availability] CRM request failed", error);
      return { ok: false as const, message: "We couldn't send that just now. Please try again in a moment." };
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[availability] CRM rejected the enquiry", response.status, detail.slice(0, 500));
      return { ok: false as const, message: "We couldn't send that just now. Please try again in a moment." };
    }

    return { ok: true as const };
  });
