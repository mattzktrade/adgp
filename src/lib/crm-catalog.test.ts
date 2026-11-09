import { describe, expect, it } from "vitest";

import {
  normalizeCatalogDay,
  normalizeCatalogSlug,
  overlayForSlug,
  parseCrmCatalogItems,
  preferredDayPrice,
} from "@/lib/crm-catalog";
import type { CrmCatalogItem } from "@/lib/crm-client";

function item(overrides: Partial<CrmCatalogItem>): CrmCatalogItem {
  return {
    slug: "velocity-terrace",
    day: "3-day weekend",
    packageId: "velocity-weekend",
    name: "3 Day Velocity Terrace",
    currency: "USD",
    unitPrice: 3995,
    sellable: 148,
    buyable: true,
    reason: null,
    ...overrides,
  };
}

describe("normalizeCatalogDay", () => {
  it("maps CRM duration labels onto the ADGP day buttons", () => {
    expect(normalizeCatalogDay("3-day weekend")).toBe("3-day weekend");
    expect(normalizeCatalogDay("3 Day")).toBe("3-day weekend");
    expect(normalizeCatalogDay("3_day")).toBe("3-day weekend");
    expect(normalizeCatalogDay("Friday only")).toBe("Friday");
    expect(normalizeCatalogDay("saturday")).toBe("Saturday");
    expect(normalizeCatalogDay("Sunday")).toBe("Sunday");
  });
});

describe("parseCrmCatalogItems", () => {
  it("coerces string prices so a CRM numeric/json mismatch still updates the page", () => {
    const items = parseCrmCatalogItems({
      packages: [
        {
          slug: "velocity-terrace",
          day: "3-day weekend",
          packageId: "velocity-weekend",
          name: "3 Day Velocity Terrace",
          currency: "USD",
          unitPrice: "3,995",
          sellable: "148",
          buyable: true,
        },
      ],
    });
    expect(items).toHaveLength(1);
    expect(items[0]?.unitPrice).toBe(3995);
    expect(items[0]?.sellable).toBe(148);
  });
});

describe("overlayForSlug live prices", () => {
  it("picks up a new 3-day price without keeping the previous figure", () => {
    const previous = overlayForSlug(
      [
        item({ unitPrice: 4850 }),
        item({ day: "Friday", packageId: "fri", name: "Friday Velocity Terrace", unitPrice: 395 }),
      ],
      "velocity-terrace",
    );
    expect(previous.fromPrice).toBe(4850);

    const updated = overlayForSlug(
      [
        item({ unitPrice: 3995 }),
        item({ day: "Friday", packageId: "fri", name: "Friday Velocity Terrace", unitPrice: 395 }),
        item({
          day: "Saturday",
          packageId: "sat",
          name: "Saturday Velocity Terrace",
          unitPrice: 1250,
        }),
        item({ day: "Sunday", packageId: "sun", name: "Sunday Velocity Terrace", unitPrice: 2495 }),
      ],
      "velocity-terrace",
    );
    expect(updated.fromPrice).toBe(3995);
    expect(updated.days.find((day) => day.day === "Saturday")?.unitPrice).toBe(1250);
    expect(preferredDayPrice(updated)?.amount).toBe(3995);
  });

  it("still matches when the CRM uses inventory-style day labels", () => {
    const overlay = overlayForSlug(
      [
        item({ day: "3 Day", unitPrice: 3995 }),
        item({
          day: "Friday only",
          packageId: "fri",
          name: "Friday Velocity Terrace",
          unitPrice: 395,
        }),
      ],
      "velocity-terrace",
    );
    expect(overlay.days.map((day) => day.day)).toEqual(["3-day weekend", "Friday"]);
    expect(overlay.fromPrice).toBe(3995);
  });

  it("does not let Velocity inventory prices overwrite Skybridge", () => {
    const overlay = overlayForSlug(
      [
        item({ unitPrice: 3995 }),
        {
          slug: "skybridge-terrace",
          day: "3-day weekend",
          packageId: "skybridge-weekend",
          name: "3 Day Skybridge Terrace",
          currency: "USD",
          unitPrice: 4850,
          sellable: 40,
          buyable: true,
          reason: null,
        },
      ],
      "skybridge-terrace",
    );
    expect(overlay.fromPrice).toBe(4850);
    expect(overlay.days).toHaveLength(1);
  });

  it("falls back to the package name when the CRM slug is missing", () => {
    const overlay = overlayForSlug(
      [item({ slug: "", name: "3 Day Velocity Terrace", unitPrice: 3995 })],
      "velocity-terrace",
    );
    expect(overlay.fromPrice).toBe(3995);
  });

  it("normalizes slug punctuation so skybridge_terrace still maps", () => {
    expect(normalizeCatalogSlug("skybridge_terrace")).toBe("skybridge-terrace");
    const overlay = overlayForSlug(
      [item({ slug: "skybridge_terrace", name: "3 Day Skybridge Terrace", unitPrice: 5200 })],
      "skybridge-terrace",
    );
    expect(overlay.fromPrice).toBe(5200);
  });

  it("does not surface Saturday & Sunday as a website day", () => {
    const overlay = overlayForSlug(
      [
        item({ unitPrice: 3995 }),
        item({
          day: "Saturday & Sunday",
          packageId: "sat-sun",
          name: "Saturday & Sunday Velocity Terrace",
          unitPrice: 3495,
        }),
      ],
      "velocity-terrace",
    );
    expect(overlay.days.map((day) => day.day)).toEqual(["3-day weekend"]);
    expect(overlay.fromPrice).toBe(3995);
  });
});
