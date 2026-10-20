import { describe, expect, it } from "vitest";

import { buildAvailabilityLead, catalogPackageName } from "@/lib/crm-lead";

const base = {
  fullName: "Jane Smith",
  email: "Jane@Example.com",
  phone: "+971500000000",
  guests: 4,
  leadId: "adgp-test",
  createdAt: "2026-10-20T12:00:00.000Z",
};

describe("availability lead payload", () => {
  it("uses the CRM package title for the day they chose", () => {
    expect(catalogPackageName("skybridge-terrace", "Friday", "Skybridge Terrace")).toBe("Friday Skybridge Terrace");
    expect(catalogPackageName("marina-views-brunch", "3-day weekend", "Marina Views Brunch")).toBe(
      "3 Day Marina Views Brunch",
    );
    expect(catalogPackageName("marsa-box", "Saturday", "Marsa Box")).toBe("Saturday Marsa Box by ZK");
    expect(catalogPackageName("south-grandstand", "3-day weekend", "South Grandstand")).toBe(
      "3 Day South Grandstand Tickets",
    );
    expect(catalogPackageName("paddock-club", "3-day weekend", "F1® Paddock Club™")).toBe("3 Day Paddock Club");
  });

  it("sends name, email, phone, guests, package and assigns Sam", () => {
    const lead = buildAvailabilityLead({
      ...base,
      slug: "marina-views-brunch",
      day: "3-day weekend",
    });
    expect(lead.ok).toBe(true);
    if (!lead.ok) return;
    expect(lead.body.ownerEmail).toBe("samantha@zk-sports.com");
    expect(lead.body.origin).toBe("website");
    expect(lead.body.contact).toEqual({
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "+971500000000",
    });
    expect(lead.body.interest).toEqual({
      package: "3 Day Marina Views Brunch",
      quantity: 4,
      event: "Abu Dhabi Grand Prix 2026",
    });
    expect(lead.body.answers).toEqual([
      { question: "Days", answer: "3-day weekend" },
      { question: "Number of guests", answer: "4" },
    ]);
  });

  it("rejects a single day on a weekend-only package", () => {
    const lead = buildAvailabilityLead({
      ...base,
      slug: "marina-views-brunch",
      day: "Friday",
    });
    expect(lead.ok).toBe(false);
  });

  it("accepts Friday for Skybridge", () => {
    const lead = buildAvailabilityLead({
      ...base,
      slug: "skybridge-terrace",
      day: "Friday",
    });
    expect(lead.ok).toBe(true);
    if (!lead.ok) return;
    expect(lead.body.interest.package).toBe("Friday Skybridge Terrace");
  });
});
