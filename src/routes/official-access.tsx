import { createFileRoute } from "@tanstack/react-router";

import { CredentialBadges } from "@/components/site/CredentialBadges";
import { GuideLayout } from "@/components/site/PageChrome";
import { EVENT } from "@/lib/packages";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/official-access")({
  head: () =>
    pageHead({
      title: `Official Abu Dhabi GP 2026 access | ${BRAND.legalName}`,
      description: `${BRAND.legalName} is an F1® Paddock Club™ Authorised Distributor and Yas Marina Circuit Official On-Seller for the ${EVENT.name}. How to verify us and why unofficial tickets get refused.`,
      path: PATHS.officialAccess,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Official access", path: PATHS.officialAccess },
        ]),
      ],
    }),
  component: OfficialAccessPage,
});

function OfficialAccessPage() {
  return (
    <GuideLayout
      eyebrow="Credentials"
      title="Official access to the Abu Dhabi Grand Prix 2026"
      lead={`${BRAND.legalName} is an F1® Paddock Club™ Authorised Distributor and a Yas Marina Circuit Official On-Seller. That is why we can sell the ten packages on this site. Yas Marina publishes the authorised partner list; ZK Sports is on it. Tickets bought outside listed channels can be refused at the gate.`}
      crumbs={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "Official access" }]}
    >
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10">
          <section>
            <h2 className="display text-4xl">How to check we are listed</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Open the circuit’s authorised onseller page and look for ZK Sports under the UAE / Middle East partners.
              The same company operates this site and{" "}
              <a href={BRAND.parentUrl} className="text-foreground underline-offset-4 hover:underline">
                zk-sports.com
              </a>
              .
            </p>
            <a
              href={BRAND.onsellerListUrl}
              className="mt-6 inline-block font-display text-lg font-bold uppercase text-primary hover:underline"
            >
              Yas Marina authorised onsellers →
            </a>
          </section>
          <section>
            <h2 className="display text-4xl">What that lets us sell</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Official Paddock Club allocation, including Team, Legend and House 44 when those rooms are open. Official
              circuit hospitality and grandstands. ZK-hosted signature lounges — Skybridge Terrace, Marsa Box and Velocity
              Terrace — which only we operate.
            </p>
          </section>
          <section>
            <h2 className="display text-4xl">Name and contact</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Legal and trading name: {BRAND.legalName}. Enquiries:{" "}
              <a href="mailto:info@zk-sports.com" className="text-foreground underline-offset-4 hover:underline">
                info@zk-sports.com
              </a>
              . Consultants reply within {BRAND.responseTime}.
            </p>
          </section>
        </div>
        <div className="border border-border p-8">
          <CredentialBadges />
          <p className="mt-8 text-sm text-muted-foreground">{BRAND.credentials}</p>
        </div>
      </div>
    </GuideLayout>
  );
}
