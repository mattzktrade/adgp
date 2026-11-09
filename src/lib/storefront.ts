import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isCheckoutReady } from "@/lib/crm-client";
import { loadCatalogOverlays, loadPackageOverlay } from "@/lib/crm-catalog";

export const STOREFRONT_CACHE_HEADERS = {
  "Cache-Control": "private, no-store",
  Pragma: "no-cache",
} as const;

export const loadPackageStorefront = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().trim().min(1).max(80) }))
  .handler(async ({ data }) => {
    const overlay = await loadPackageOverlay(data.slug, { live: true });
    return { overlay, checkoutEnabled: isCheckoutReady() };
  });

export const loadListingStorefront = createServerFn({ method: "GET" }).handler(async () => {
  const overlays = Object.fromEntries(await loadCatalogOverlays({ live: true }));
  return { overlays, checkoutEnabled: isCheckoutReady() };
});
