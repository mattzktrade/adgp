import { describe, expect, it } from "vitest";

import { buildE164, matchCountryFromDigits, phoneCountry, phoneCountrySearchValue } from "@/lib/phone";

describe("buildE164", () => {
  it("adds the UAE code and drops a leading 0", () => {
    expect(buildE164("971", "050 123 4567")).toBe("+971501234567");
    expect(buildE164("971", "50 123 4567")).toBe("+971501234567");
  });

  it("adds the UK code and drops a leading 0", () => {
    expect(buildE164("44", "07700 900123")).toBe("+447700900123");
  });

  it("does not double the country code when a full number is pasted", () => {
    expect(buildE164("971", "+971501234567")).toBe("+971501234567");
    expect(buildE164("44", "00447700900123")).toBe("+447700900123");
  });

  it("rejects numbers that are too short", () => {
    expect(buildE164("971", "50")).toBeNull();
    expect(buildE164("971", "")).toBeNull();
  });
});

describe("matchCountryFromDigits", () => {
  it("prefers the longest dial code", () => {
    expect(matchCountryFromDigits("971501234567")?.iso).toBe("AE");
    expect(matchCountryFromDigits("447700900123")?.iso).toBe("GB");
  });
});

describe("phoneCountrySearchValue", () => {
  it("is findable by name, alias and dial code", () => {
    const value = phoneCountrySearchValue(phoneCountry("AE")).toLowerCase();
    expect(value).toContain("united arab emirates");
    expect(value).toContain("uae");
    expect(value).toContain("+971");
    expect(value).toContain("971");
  });
});
