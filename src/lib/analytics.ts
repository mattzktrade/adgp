const rawGaId = (import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined)?.trim();
export const GA_MEASUREMENT_ID = rawGaId && /^G-[A-Z0-9]{4,20}$/.test(rawGaId) ? rawGaId : undefined;

/** ZK Sports Meta Pixel. Override with VITE_META_PIXEL_ID if Events Manager ever issues a new ID. */
export const DEFAULT_META_PIXEL_ID = "363256217725284";

export function parseMetaPixelId(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  return value && /^\d{5,20}$/.test(value) ? value : undefined;
}

export const META_PIXEL_ID =
  parseMetaPixelId(import.meta.env["VITE_META_PIXEL_ID"] as string | undefined) ?? DEFAULT_META_PIXEL_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function metaPixelBootstrapScript(id: string): string {
  const pixelId = parseMetaPixelId(id);
  if (!pixelId) return "";
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);n('init','${pixelId}')}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`;
}

export function metaPixelNoscriptSrc(id: string): string | undefined {
  const pixelId = parseMetaPixelId(id);
  return pixelId ? `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1` : undefined;
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackViewContent(params: {
  contentName: string;
  contentId: string;
  contentCategory: string;
  value?: number;
  currency?: string;
}) {
  fbq("track", "ViewContent", {
    content_name: params.contentName,
    content_ids: [params.contentId],
    content_type: "product",
    content_category: params.contentCategory,
    ...(typeof params.value === "number" ? { value: params.value, currency: params.currency || "USD" } : {}),
  });
}

export function trackGenerateLead(params: { packageName: string; day: string; guests: number }) {
  gtag("event", "generate_lead", {
    currency: "USD",
    package_name: params.packageName,
    day: params.day,
    guests: params.guests,
  });
  fbq("track", "Lead", {
    content_name: params.packageName,
    content_category: params.day,
    num_items: params.guests,
  });
}

export function trackBeginCheckout(params: { packageName: string; day: string; guests: number; value: number }) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: params.value,
    package_name: params.packageName,
    day: params.day,
    guests: params.guests,
  });
  fbq("track", "InitiateCheckout", {
    content_name: params.packageName,
    content_category: params.day,
    num_items: params.guests,
    value: params.value,
    currency: "USD",
  });
}

export function trackPurchase(params: {
  transactionId: string;
  packageName: string;
  guests: number;
  value: number;
  currency: string;
}) {
  if (typeof sessionStorage !== "undefined") {
    const key = `adgp_purchase_${params.transactionId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  }
  gtag("event", "purchase", {
    transaction_id: params.transactionId,
    currency: params.currency,
    value: params.value,
    package_name: params.packageName,
    guests: params.guests,
  });
  fbq(
    "track",
    "Purchase",
    {
      content_name: params.packageName,
      num_items: params.guests,
      value: params.value,
      currency: params.currency,
    },
    { eventID: params.transactionId },
  );
}
