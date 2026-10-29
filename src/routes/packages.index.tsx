import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/PageChrome";
import { Eyebrow, Footer, Nav } from "@/components/site/parts";
import { formatMoney } from "@/lib/crm-catalog";
import { loadListingStorefront } from "@/lib/storefront";
import { EVENT, PACKAGES, TIERS } from "@/lib/packages";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/packages/")({
  loader: async () => loadListingStorefront(),
  head: () =>
    pageHead({
      title: `Abu Dhabi GP 2026 packages | ${BRAND.legalName}`,
      description: `All ten official and ZK-hosted hospitality packages for the ${EVENT.name} at ${EVENT.circuit}, ${EVENT.raceWeekend}. Paddock Club™, signature lounges and grandstands. Live prices where we sell online.`,
      path: PATHS.packages,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Packages", path: PATHS.packages },
        ]),
      ],
    }),
  component: PackagesIndex,
});

function PackagesIndex() {
  const { overlays } = Route.useLoaderData();
  return (
    <div className="min-h-svh">
      <Nav solid />
      <header className="border-b border-border">
        <div className="page-offset mx-auto max-w-[1600px] px-5 pb-14 md:px-10 md:pb-20">
          <Breadcrumbs items={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "Packages" }]} />
          <Eyebrow className="mt-8">Hospitality collection</Eyebrow>
          <h1 className="display mt-5 max-w-5xl text-[clamp(2.35rem,6.5vw,5.5rem)]">Abu Dhabi GP 2026 packages</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            {BRAND.legalName} sells ten ways to watch the {EVENT.name} at {EVENT.circuit}. Race weekend {EVENT.raceWeekend}.
            Three ZK-hosted lounges, official hospitality including F1® Paddock Club™, and three grandstands. Live
            prices where we sell online; Paddock Club variants stay with a consultant.
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <div className="divide-y divide-border border-y border-border">
          {PACKAGES.map((pkg) => (
            <Link
              key={pkg.slug}
              to="/packages/$slug"
              params={{ slug: pkg.slug }}
              className="grid gap-4 py-8 md:grid-cols-[88px_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:gap-8"
            >
              <span className="font-mono text-sm text-primary">{pkg.id}</span>
              <div>
                <h2 className="display text-[clamp(1.75rem,4vw,3.75rem)]">{pkg.name}</h2>
                <p className="mt-2 text-muted-foreground">{pkg.lead}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>{TIERS[pkg.tier].label}</div>
                <div>{pkg.where}</div>
                <div>{pkg.daysLabel}</div>
              </div>
              <span className="font-display text-lg font-bold uppercase text-sand">
                {overlays[pkg.slug]?.fromPrice
                  ? `${formatMoney(overlays[pkg.slug]!.fromPrice!, overlays[pkg.slug]!.currency)} →`
                  : pkg.hosted
                    ? "Hosted by ZK →"
                    : "Official →"}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
