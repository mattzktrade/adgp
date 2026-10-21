import { describe, expect, it } from "vitest";

import { PACKAGES } from "@/lib/packages";
import { BRAND, SITE_URL, absoluteUrl, packagePath } from "@/lib/site";
import { buildSitemapXml, pageHead, plainMeta, productJsonLd, sitemapEntries } from "@/lib/seo";

describe("SEO helpers", () => {
  it("builds production canonicals and Open Graph tags", () => {
    const head = pageHead({
      title: "Test title",
      description: "Test description",
      path: "/compare",
      image: "/gallery/skybridge-181.jpg",
    });
    expect(head.links).toEqual([{ rel: "canonical", href: `${SITE_URL}/compare` }]);
    expect(head.meta.some((tag) => "property" in tag && tag.property === "og:image")).toBe(true);
    expect(head.meta.some((tag) => "name" in tag && tag.name === "twitter:image")).toBe(true);
  });

  it("writes ampersands as and so Slack previews do not show &amp;", () => {
    expect(plainMeta("hospitality & official tickets | ZK Sports & Entertainment")).toBe(
      "hospitality and official tickets | ZK Sports and Entertainment",
    );
    const head = pageHead({
      title: "Abu Dhabi Grand Prix 2026 hospitality & official tickets | ZK Sports & Entertainment",
      description: "Tickets from ZK Sports & Entertainment",
      path: "/",
    });
    const title = head.meta.find((tag) => "title" in tag && !("name" in tag) && !("property" in tag));
    expect(title).toMatchObject({ title: "Abu Dhabi Grand Prix 2026 hospitality and official tickets | ZK Sports and Entertainment" });
    expect(head.meta).toContainEqual({
      property: "og:title",
      content: "Abu Dhabi Grand Prix 2026 hospitality and official tickets | ZK Sports and Entertainment",
    });
    expect(head.meta).toContainEqual({
      property: "og:site_name",
      content: "ZK Sports and Entertainment",
    });
  });

  it("lists every public page and package in the sitemap", () => {
    const paths = sitemapEntries().map((entry) => entry.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/packages");
    expect(paths).toContain("/compare");
    expect(paths).toContain("/guides/paddock-club");
    expect(paths).toContain("/privacy");
    for (const pkg of PACKAGES) {
      expect(paths).toContain(packagePath(pkg.slug));
    }
    expect(buildSitemapXml("2026-10-21")).toContain(`<loc>${absoluteUrl("/packages/skybridge-terrace")}</loc>`);
  });

  it("keeps the brand entity stable", () => {
    expect(BRAND.legalName).toBe("ZK Sports & Entertainment");
    expect(BRAND.sameAs).toContain("https://www.zk-sports.com");
  });

  it("puts a live overlay price on product JSON-LD and keeps Paddock off the cart", () => {
    const skybridge = PACKAGES.find((pkg) => pkg.slug === "skybridge-terrace");
    const paddock = PACKAGES.find((pkg) => pkg.slug === "paddock-club");
    expect(skybridge && paddock).toBeTruthy();
    const priced = productJsonLd(skybridge!, {
      slug: "skybridge-terrace",
      fromPrice: 495,
      currency: "USD",
      anyBuyable: true,
      days: [
        {
          day: "Friday",
          packageId: "abudhabi-skybridge-terrace-friday-2026",
          name: "Friday Skybridge",
          currency: "USD",
          unitPrice: 495,
          sellable: 8,
          buyable: true,
          reason: null,
        },
      ],
    });
    expect(priced.offers.price).toBe(495);
    expect(priced.offers.availability).toBe("https://schema.org/InStock");
    const contact = productJsonLd(paddock!);
    expect(contact.offers.price).toBeUndefined();
    expect(String(contact.offers.description)).toMatch(/Contact us/i);
  });
});
