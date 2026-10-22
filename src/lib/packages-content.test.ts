import { describe, expect, it } from "vitest";

import { GUIDES, SHARED_FAQS } from "@/lib/content";
import { EVENT, PACKAGES } from "@/lib/packages";
import { PATHS } from "@/lib/site";

describe("catalog content for search", () => {
  it("publishes race weekend and Thursday fan days separately", () => {
    expect(EVENT.startDate).toBe("2026-12-04");
    expect(EVENT.endDate).toBe("2026-12-06");
    expect(EVENT.fanStartDate).toBe("2026-12-03");
    expect(EVENT.raceWeekend).toContain("4–6 December 2026");
  });

  it("gives every package a unique lead, meta description and FAQs", () => {
    const leads = new Set(PACKAGES.map((pkg) => pkg.lead));
    const metas = new Set(PACKAGES.map((pkg) => pkg.metaDescription));
    expect(leads.size).toBe(PACKAGES.length);
    expect(metas.size).toBe(PACKAGES.length);
    for (const pkg of PACKAGES) {
      expect(pkg.faqs.length).toBeGreaterThanOrEqual(4);
      expect(pkg.lead.length).toBeGreaterThan(80);
    }
  });

  it("tells people they can pay on the package page", () => {
    const howToBuy = GUIDES.find((guide) => guide.path === PATHS.howToBuy);
    expect(howToBuy?.lead).toMatch(/Pay online|pay by card|live-priced/i);
    expect(howToBuy?.sections.some((section) => section.body.join(" ").includes("Stripe"))).toBe(true);
    expect(SHARED_FAQS.some((faq) => faq.a.includes("current CRM price"))).toBe(true);
  });

  it("does not clone the shared FAQ onto package pages", () => {
    const shared = new Set(SHARED_FAQS.map((faq) => faq.q));
    for (const pkg of PACKAGES) {
      for (const faq of pkg.faqs) {
        expect(shared.has(faq.q)).toBe(false);
      }
    }
  });
});
