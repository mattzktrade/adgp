import { createFileRoute, Link } from "@tanstack/react-router";

import { GuideLayout } from "@/components/site/PageChrome";
import { formatMoney, loadCatalogOverlays } from "@/lib/crm-catalog";
import { EVENT, PACKAGES, TIERS } from "@/lib/packages";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/compare")({
  loader: async () => ({ overlays: Object.fromEntries(await loadCatalogOverlays()) }),
  head: () =>
    pageHead({
      title: `Compare Abu Dhabi GP 2026 hospitality | ${BRAND.shortName}`,
      description: `Paddock Club vs Skybridge vs grandstands: compare all ten ${EVENT.name} venues at ${EVENT.circuit} — view, days, live prices and who each package is for.`,
      path: PATHS.compare,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Compare", path: PATHS.compare },
        ]),
      ],
    }),
  component: ComparePage,
});

function ComparePage() {
  const { overlays } = Route.useLoaderData();
  return (
    <GuideLayout
      eyebrow="Side by side"
      title="Compare Abu Dhabi GP 2026 hospitality"
      lead={`The ten packages ZK Sports & Entertainment sells for the ${EVENT.name} differ by view, format and days. Paddock Club is official pit-lane hospitality. Skybridge is the only venue built over the track. Grandstands are seats. This table is the short version; each name opens the full page.`}
      crumbs={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "Compare" }]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <caption className="sr-only">Comparison of ten Abu Dhabi Grand Prix 2026 packages</caption>
          <thead>
            <tr className="eyebrow text-muted-foreground">
              <th className="border-b border-border py-3 pr-4 font-normal">Package</th>
              <th className="border-b border-border py-3 pr-4 font-normal">Tier</th>
              <th className="border-b border-border py-3 pr-4 font-normal">View</th>
              <th className="border-b border-border py-3 pr-4 font-normal">Days</th>
              <th className="border-b border-border py-3 pr-4 font-normal">From</th>
              <th className="border-b border-border py-3 pr-4 font-normal">Best for</th>
              <th className="border-b border-border py-3 font-normal">Host</th>
            </tr>
          </thead>
          <tbody>
            {PACKAGES.map((pkg) => (
              <tr key={pkg.slug} className="align-top">
                <td className="border-b border-border py-4 pr-4">
                  <Link to="/packages/$slug" params={{ slug: pkg.slug }} className="font-display text-lg font-bold uppercase hover:text-primary">
                    {pkg.name}
                  </Link>
                </td>
                <td className="border-b border-border py-4 pr-4 text-muted-foreground">{TIERS[pkg.tier].label}</td>
                <td className="border-b border-border py-4 pr-4">{pkg.where}</td>
                <td className="border-b border-border py-4 pr-4 text-muted-foreground">{pkg.daysLabel}</td>
                <td className="border-b border-border py-4 pr-4 text-muted-foreground">
                  {overlays[pkg.slug]?.fromPrice
                    ? formatMoney(overlays[pkg.slug]!.fromPrice!, overlays[pkg.slug]!.currency)
                    : pkg.slug === "paddock-club"
                      ? "Contact"
                      : "—"}
                </td>
                <td className="border-b border-border py-4 pr-4">{pkg.bestFor}</td>
                <td className="border-b border-border py-4">{pkg.hosted ? "ZK Sports" : "Official"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-3">
        <div>
          <h2 className="display text-3xl">Paddock Club vs Skybridge</h2>
          <p className="mt-4 text-muted-foreground">
            Choose Paddock Club for the pit lane, the walk and official Formula 1 hospitality. Choose Skybridge if you want cars passing under a glass lounge at Turns 11–14 — a ZK-hosted room the Club does not offer.
          </p>
        </div>
        <div>
          <h2 className="display text-3xl">Marsa Box vs Velocity</h2>
          <p className="mt-4 text-muted-foreground">
            Both look at Turns 8–11 and both are hosted by ZK. Marsa Box is the covered lounge above the F2 garages. Velocity is the open terrace with champagne. Both can be booked by the day.
          </p>
        </div>
        <div>
          <h2 className="display text-3xl">Seat or lounge</h2>
          <p className="mt-4 text-muted-foreground">
            West, North and South Grandstands are seats with concerts and Fanzone. South Club adds a lounge at Turn 9. Club 58 and Marina Views are official tables. Read the{" "}
            <Link to={PATHS.seats} className="text-foreground underline-offset-4 hover:underline">
              seating guide
            </Link>
            .
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
