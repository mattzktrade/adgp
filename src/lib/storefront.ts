import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isCheckoutReady } from "@/lib/crm-client";
import { loadCatalogOverlays, loadPackageOverlay } from "@/lib/crm-catalog";

export const loadPackageStorefront = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().trim().min(1).max(80) }))
  .handler(async ({ data }) => {
    const overlay = await loadPackageOverlay(data.slug);
    return { overlay, checkoutEnabled: isCheckoutReady() };
  });

export const loadListingStorefront = createServerFn({ method: "GET" }).handler(async () => {
  const overlays = Object.fromEntries(await loadCatalogOverlays());
  return { overlays, checkoutEnabled: isCheckoutReady() };
});
