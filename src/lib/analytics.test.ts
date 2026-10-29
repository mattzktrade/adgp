import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_META_PIXEL_ID,
  metaPixelBootstrapScript,
  metaPixelNoscriptSrc,
  parseMetaPixelId,
  trackGenerateLead,
  trackPageView,
  trackPurchase,
  trackViewContent,
} from "@/lib/analytics";

describe("Meta Pixel ID", () => {
  it("accepts the ZK Sports pixel and rejects anything that is not digits", () => {
    expect(parseMetaPixelId(DEFAULT_META_PIXEL_ID)).toBe("363256217725284");
    expect(parseMetaPixelId(" 363256217725284 ")).toBe("363256217725284");
    expect(parseMetaPixelId("")).toBeUndefined();
    expect(parseMetaPixelId("363256217725284';alert(1)")).toBeUndefined();
  });

  it("inits the pixel in the head script without a first PageView (SPA fires that on route change)", () => {
    const script = metaPixelBootstrapScript(DEFAULT_META_PIXEL_ID);
    expect(script).toContain("connect.facebook.net/en_US/fbevents.js");
    expect(script).toContain("n('init','363256217725284')");
    expect(script).not.toContain("PageView");
    expect(metaPixelBootstrapScript("nope")).toBe("");
  });

  it("builds the noscript fallback used in the page body", () => {
    expect(metaPixelNoscriptSrc(DEFAULT_META_PIXEL_ID)).toBe(
      "https://www.facebook.com/tr?id=363256217725284&ev=PageView&noscript=1",
    );
    expect(metaPixelNoscriptSrc("abc")).toBeUndefined();
  });
});

describe("Meta Pixel events", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it("sends PageView, ViewContent, Lead and Purchase through fbq", () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", Object.assign(window, { fbq }));

    trackPageView();
    trackViewContent({
      contentName: "Skybridge Terrace",
      contentId: "skybridge-terrace",
      contentCategory: "ZK Signature Lounges",
      value: 1200,
      currency: "USD",
    });
    trackGenerateLead({ packageName: "Marsa Box by ZK", day: "Sunday", guests: 4 });
    trackPurchase({
      transactionId: "ord_1",
      packageName: "Marsa Box by ZK",
      guests: 4,
      value: 4800,
      currency: "USD",
    });
    trackPurchase({
      transactionId: "ord_1",
      packageName: "Marsa Box by ZK",
      guests: 4,
      value: 4800,
      currency: "USD",
    });

    expect(fbq).toHaveBeenCalledWith("track", "PageView");
    expect(fbq).toHaveBeenCalledWith("track", "ViewContent", {
      content_name: "Skybridge Terrace",
      content_ids: ["skybridge-terrace"],
      content_type: "product",
      content_category: "ZK Signature Lounges",
      value: 1200,
      currency: "USD",
    });
    expect(fbq).toHaveBeenCalledWith("track", "Lead", {
      content_name: "Marsa Box by ZK",
      content_category: "Sunday",
      num_items: 4,
    });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Purchase",
      {
        content_name: "Marsa Box by ZK",
        num_items: 4,
        value: 4800,
        currency: "USD",
      },
      { eventID: "ord_1" },
    );
    expect(fbq.mock.calls.filter((call) => call[1] === "Purchase")).toHaveLength(1);
  });
});
