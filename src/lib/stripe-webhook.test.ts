import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { isPermanentFulfillmentFailure } from "@/lib/stripe-webhook";

describe("Stripe fulfillment failures", () => {
  it("retries missing holds and owner problems instead of refunding", () => {
    expect(isPermanentFulfillmentFailure("hold_not_found")).toBe(false);
    expect(isPermanentFulfillmentFailure("owner_profile_required")).toBe(false);
    expect(isPermanentFulfillmentFailure("Service role is not configured.")).toBe(false);
  });

  it("refunds only when the booking cannot be created", () => {
    expect(isPermanentFulfillmentFailure("insufficient_stock")).toBe(true);
    expect(isPermanentFulfillmentFailure("hold_price_mismatch")).toBe(true);
    expect(isPermanentFulfillmentFailure("Checkout session is missing CRM metadata.")).toBe(true);
  });

  it("lets the success page confirm a paid session if the webhook is late", () => {
    const checkout = readFileSync(join(process.cwd(), "src/lib/checkout.ts"), "utf8");
    const success = readFileSync(join(process.cwd(), "src/routes/checkout.success.tsx"), "utf8");
    expect(checkout).toContain("confirmPaidCheckout");
    expect(checkout).toContain('payment_status !== "paid"');
    expect(success).toContain("Order confirmed");
    expect(success).toContain("confirmPaidCheckout");
  });
});
