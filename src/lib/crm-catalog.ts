import { dayOptionsFor, getPackage } from "@/lib/packages";
import { crmAdgpFetch, isCrmCatalogConfigured, type CrmCatalogItem } from "@/lib/crm-client";

export type DayAvailability = {
  day: string;
  packageId: string;
  name: string;
  currency: string;
  unitPrice: number;
  sellable: number;
  buyable: boolean;
  reason: string | null;
};

export type PackageOverlay = {
  slug: string;
  days: DayAvailability[];
  fromPrice: number | null;
  currency: string;
  anyBuyable: boolean;
};

const CACHE_MS = 5_000;
const FETCH_MS = 8_000;
let catalogCache: { at: number; items: CrmCatalogItem[] } | null = null;

export function availabilityLabel(sellable: number, buyable: boolean): string {
  if (!buyable && sellable <= 0) return "Sold out";
  if (!buyable) return "Contact us";
  if (sellable <= 10) return `Only ${sellable} left`;
  return "Available";
}

export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}

export function normalizeCatalogSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

/** Map CRM day labels onto the labels the ADGP package pages actually render. */
export function normalizeCatalogDay(day: string): string {
  const normalized = day.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  if (!normalized) return day.trim();
  if (/^3\s*days?(?:\s+weekend)?$/.test(normalized) || normalized === "weekend")
    return "3-day weekend";
  if (/^friday(?:\s+only)?$/.test(normalized)) return "Friday";
  if (/^saturday(?:\s+only)?$/.test(normalized)) return "Saturday";
  if (/^sunday(?:\s+only)?$/.test(normalized)) return "Sunday";
  if (/^saturday\s*(?:and|&)\s*sunday$/.test(normalized) || /^2\s*days?$/.test(normalized)) {
    return "Saturday & Sunday";
  }
  return day.trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function readNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/,/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return Number.NaN;
}

export function parseCrmCatalogItems(body: unknown): CrmCatalogItem[] {
  const record = asRecord(body);
  const raw = record ? (record["packages"] ?? record["items"] ?? record["catalog"]) : body;
  const list = Array.isArray(raw) ? raw : [];
  const items: CrmCatalogItem[] = [];
  for (const entry of list) {
    const item = asRecord(entry);
    if (!item) continue;
    const slug = readString(item["slug"]);
    const day = readString(item["day"]);
    if (!slug || !day) continue;
    const unitPrice = readNumber(item["unitPrice"], item["unit_price"]);
    const sellable = readNumber(item["sellable"]);
    const reason = readString(item["reason"]);
    items.push({
      slug,
      day,
      packageId: readString(item["packageId"], item["package_id"], item["id"]) || `${slug}:${day}`,
      name: readString(item["name"]) || slug,
      currency: readString(item["currency"]) || "USD",
      unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
      sellable: Number.isFinite(sellable) ? Math.max(0, Math.floor(sellable)) : 0,
      buyable: item["buyable"] === true || item["buyable"] === "true",
      reason: reason || null,
    });
  }
  return items;
}

function itemsForSlug(items: CrmCatalogItem[], slug: string): CrmCatalogItem[] {
  const wanted = normalizeCatalogSlug(slug);
  const bySlug = items.filter((item) => normalizeCatalogSlug(item.slug) === wanted);
  if (bySlug.length > 0) return bySlug;
  const pkg = getPackage(slug);
  const needle = pkg?.name.trim().toLowerCase() ?? "";
  if (!needle) return [];
  return items.filter((item) => item.name.trim().toLowerCase().includes(needle));
}

async function fetchCrmCatalogOnce(): Promise<CrmCatalogItem[]> {
  const response = await crmAdgpFetch("/catalog", { signal: AbortSignal.timeout(FETCH_MS) });
  if (!response.ok) {
    throw new Error(`CRM catalog rejected ${response.status}`);
  }
  return parseCrmCatalogItems(await response.json());
}

export async function fetchCrmCatalog(options?: { live?: boolean }): Promise<CrmCatalogItem[]> {
  if (!isCrmCatalogConfigured()) return [];
  const live = options?.live !== false;
  if (
    !live &&
    catalogCache &&
    catalogCache.items.length > 0 &&
    Date.now() - catalogCache.at < CACHE_MS
  ) {
    return catalogCache.items;
  }
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const items = await fetchCrmCatalogOnce();
      if (items.length > 0) catalogCache = { at: Date.now(), items };
      return items;
    } catch (error) {
      lastError = error;
    }
  }
  console.error("[catalog] CRM catalog failed", lastError);
  return catalogCache?.items ?? [];
}

export function overlayForSlug(items: CrmCatalogItem[], slug: string): PackageOverlay {
  const candidates = itemsForSlug(items, slug);
  const days = dayOptionsFor(slug)
    .map((day) => {
      const item = candidates.find((candidate) => normalizeCatalogDay(candidate.day) === day);
      if (!item) return null;
      return {
        day,
        packageId: item.packageId,
        name: item.name,
        currency: item.currency || "USD",
        unitPrice: Number(item.unitPrice) || 0,
        sellable: Math.max(0, Math.floor(Number(item.sellable) || 0)),
        buyable: Boolean(item.buyable),
        reason: item.reason,
      } satisfies DayAvailability;
    })
    .filter((day): day is DayAvailability => Boolean(day));
  const priced = days.filter((day) => day.buyable && day.unitPrice > 0);
  const weekend = priced.find((day) => day.day === "3-day weekend");
  return {
    slug,
    days,
    fromPrice:
      weekend?.unitPrice ??
      (priced.length ? Math.min(...priced.map((day) => day.unitPrice)) : null),
    currency: weekend?.currency || priced[0]?.currency || days[0]?.currency || "USD",
    anyBuyable: priced.length > 0,
  };
}

export async function loadPackageOverlay(
  slug: string,
  options?: { live?: boolean },
): Promise<PackageOverlay> {
  try {
    return overlayForSlug(await fetchCrmCatalog(options), slug);
  } catch (error) {
    console.error("[catalog] overlay failed", error);
    return { slug, days: [], fromPrice: null, currency: "USD", anyBuyable: false };
  }
}

export function preferredDayPrice(
  overlay: PackageOverlay,
): { amount: number; currency: string; sellable: number; buyable: boolean } | null {
  const preferred = overlay.days.find(
    (day) => day.day === "3-day weekend" && day.buyable && day.unitPrice > 0,
  );
  const fallback = overlay.days.find((day) => day.buyable && day.unitPrice > 0);
  const day = preferred ?? fallback;
  if (!day) return null;
  return {
    amount: day.unitPrice,
    currency: day.currency,
    sellable: day.sellable,
    buyable: day.buyable,
  };
}

export async function loadCatalogOverlays(options?: {
  live?: boolean;
}): Promise<Map<string, PackageOverlay>> {
  const items = await fetchCrmCatalog(options).catch(() => [] as CrmCatalogItem[]);
  const slugs = [...new Set(items.map((item) => normalizeCatalogSlug(item.slug)))];
  return new Map(slugs.map((slug) => [slug, overlayForSlug(items, slug)]));
}
