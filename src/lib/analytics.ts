export const GA_MEASUREMENT_ID = (import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined)?.trim();

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGenerateLead(params: { packageName: string; day: string; guests: number }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", {
    currency: "USD",
    package_name: params.packageName,
    day: params.day,
    guests: params.guests,
  });
}

export function trackBeginCheckout(params: { packageName: string; day: string; guests: number; value: number }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "begin_checkout", {
    currency: "USD",
    value: params.value,
    package_name: params.packageName,
    day: params.day,
    guests: params.guests,
  });
}

export function trackPurchase(params: {
  transactionId: string;
  packageName: string;
  guests: number;
  value: number;
  currency: string;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "purchase", {
    transaction_id: params.transactionId,
    currency: params.currency,
    value: params.value,
    package_name: params.packageName,
    guests: params.guests,
  });
}
