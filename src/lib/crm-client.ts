export const DEFAULT_CRM_ADGP_API_URL = "https://zk-sports.trade/api/adgp";

export function crmAdgpApiUrl(): string {
  return (process.env.CRM_ADGP_API_URL?.trim() || DEFAULT_CRM_ADGP_API_URL).replace(/\/$/, "");
}

export function crmAdgpSecret(): string {
  return process.env.CRM_ADGP_SECRET?.trim() || "";
}

export function isWebsiteCheckoutEnabled(): boolean {
  const flag = process.env.WEBSITE_CHECKOUT_ENABLED?.trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}

export function isCrmCatalogConfigured(): boolean {
  return Boolean(crmAdgpSecret());
}

export async function crmAdgpFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const secret = crmAdgpSecret();
  if (!secret) throw new Error("CRM_ADGP_SECRET is not set");
  const headers = new Headers(init.headers);
  headers.set("x-adgp-secret", secret);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return fetch(`${crmAdgpApiUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
  });
}

export type CrmCatalogItem = {
  slug: string;
  day: string;
  packageId: string;
  name: string;
  currency: string;
  unitPrice: number;
  sellable: number;
  buyable: boolean;
  reason: string | null;
};

export type CrmHold = {
  holdId: string;
  expiresAt: string;
  packageId: string;
  packageName: string;
  slug: string;
  day: string;
  guests: number;
  unitPrice: number;
  currency: string;
  total: number;
};

export type CrmOrderLookup = {
  pending: boolean;
  orderId?: string;
  orderReference?: string;
  dealReference?: string | null;
  packageName?: string | null;
  guests?: number;
  totalAmount?: number;
  currency?: string;
};
