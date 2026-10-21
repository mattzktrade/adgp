import { dayOptionsFor } from "@/lib/packages";
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

const CACHE_MS = 30_000;
let catalogCache: { at: number; items: CrmCatalogItem[] } | null = null;

export function availabilityLabel(sellable: number, buyable: boolean): string {
  if (!buyable && sellable <= 0) return "Sold out";
  if (!buyable) return "Contact us";
  if (sellable <= 10) return `Only ${sellable} left`;
  return "Available";
}

export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}

export async function fetchCrmCatalog(options?: { live?: boolean }): Promise<CrmCatalogItem[]> {
  if (!isCrmCatalogConfigured()) return [];
  const live = options?.live === true;
  if (!live && catalogCache && Date.now() - catalogCache.at < CACHE_MS) {
    return catalogCache.items;
  }
  const response = await crmAdgpFetch("/catalog");
  if (!response.ok) {
    console.error("[catalog] CRM rejected catalog", response.status);
    return catalogCache?.items ?? [];
  }
  const body = (await response.json()) as { packages?: CrmCatalogItem[] };
  const items = Array.isArray(body.packages) ? body.packages : [];
  catalogCache = { at: Date.now(), items };
  return items;
}

export function overlayForSlug(items: CrmCatalogItem[], slug: string): PackageOverlay {
  const days = dayOptionsFor(slug)
    .map((day) => items.find((item) => item.slug === slug && item.day === day))
    .filter((item): item is CrmCatalogItem => Boolean(item))
    .map((item) => ({
      day: item.day,
      packageId: item.packageId,
      name: item.name,
      currency: item.currency,
      unitPrice: item.unitPrice,
      sellable: item.sellable,
      buyable: item.buyable,
      reason: item.reason,
    }));
  const priced = days.filter((day) => day.buyable && day.unitPrice > 0);
  return {
    slug,
    days,
    fromPrice: priced.length ? Math.min(...priced.map((day) => day.unitPrice)) : null,
    currency: priced[0]?.currency || days[0]?.currency || "USD",
    anyBuyable: priced.length > 0,
  };
}

export async function loadPackageOverlay(slug: string, options?: { live?: boolean }): Promise<PackageOverlay> {
  try {
    return overlayForSlug(await fetchCrmCatalog(options), slug);
  } catch (error) {
    console.error("[catalog] overlay failed", error);
    return { slug, days: [], fromPrice: null, currency: "USD", anyBuyable: false };
  }
}

export async function loadCatalogOverlays(options?: { live?: boolean }): Promise<Map<string, PackageOverlay>> {
  const items = await fetchCrmCatalog(options).catch(() => [] as CrmCatalogItem[]);
  const slugs = [...new Set(items.map((item) => item.slug))];
  return new Map(slugs.map((slug) => [slug, overlayForSlug(items, slug)]));
}
