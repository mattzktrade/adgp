import { describe, expect, it } from "vitest";

import { overlayForSlug, availabilityLabel, formatMoney } from "@/lib/crm-catalog";
import type { CrmCatalogItem } from "@/lib/crm-client";

const skybridgeFriday: CrmCatalogItem = {
  slug: "skybridge-terrace",
  day: "Friday",
  packageId: "abudhabi-skybridge-terrace-friday-2026",
  name: "Friday Skybridge Terrace",
  currency: "USD",
  unitPrice: 495,
  sellable: 12,
  buyable: true,
  reason: null,
};

describe("catalog overlay", () => {
  it("picks the lowest buyable day as the from-price", () => {
    const overlay = overlayForSlug(
      [
        skybridgeFriday,
        { ...skybridgeFriday, day: "Sunday", unitPrice: 3500, packageId: "sun" },
        { ...skybridgeFriday, slug: "paddock-club", day: "3-day weekend", buyable: false, reason: "contact" },
      ],
      "skybridge-terrace",
    );
    expect(overlay.fromPrice).toBe(495);
    expect(overlay.anyBuyable).toBe(true);
    expect(overlay.days).toHaveLength(2);
  });

  it("labels remaining seats without inventing a price", () => {
    expect(availabilityLabel(12, true)).toBe("Available");
    expect(availabilityLabel(4, true)).toBe("Only 4 left");
    expect(availabilityLabel(0, false)).toBe("Sold out");
    expect(formatMoney(495, "USD")).toContain("495");
  });

  it("does not invent a from-price when every day is contact-only", () => {
    const overlay = overlayForSlug(
      [
        {
          ...skybridgeFriday,
          slug: "paddock-club",
          day: "3-day weekend",
          buyable: false,
          unitPrice: 0,
          reason: "contact",
        },
      ],
      "paddock-club",
    );
    expect(overlay.fromPrice).toBeNull();
    expect(overlay.anyBuyable).toBe(false);
  });
});
