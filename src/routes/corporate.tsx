import { createFileRoute, Link } from "@tanstack/react-router";

import { GuideLayout } from "@/components/site/PageChrome";
import { EVENT } from "@/lib/packages";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, CONTACT_EMAIL, PATHS } from "@/lib/site";

export const Route = createFileRoute("/corporate")({
  head: () =>
    pageHead({
      title: `Corporate F1 hospitality Abu Dhabi 2026 | ${BRAND.shortName}`,
      description: `Corporate groups at the ${EVENT.name}: tables, private areas, Paddock Club suites, hotels and transfers from ${BRAND.legalName}, an official Yas Marina onseller.`,
      path: PATHS.corporate,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Corporate", path: PATHS.corporate },
        ]),
      ],
    }),
  component: CorporatePage,
});

function CorporatePage() {
  return (
    <GuideLayout
      eyebrow="Groups and companies"
      title="Corporate hospitality at the Abu Dhabi GP 2026"
      lead={`${BRAND.legalName} hosts company groups at the ${EVENT.name} — from a single table in Marsa Box to a private area on Skybridge Terrace or a Paddock Club suite. We add Yas Island hotels and airport transfers. Listed packages can be bought online; mixed or private inventory stays with a consultant.`}
      crumbs={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "Corporate" }]}
    >
      <div className="grid gap-14 lg:grid-cols-2">
        <section>
          <h2 className="display text-4xl">What we arrange for companies</h2>
          <ul className="mt-8 space-y-4 text-lg text-muted-foreground">
            <li className="border-t border-border pt-4">Tables or a private area in a ZK-hosted lounge (Skybridge, Marsa Box, Velocity Terrace).</li>
            <li className="border-t border-border pt-4">Official Paddock Club, including Team, Legend and House 44 when allocation remains.</li>
            <li className="border-t border-border pt-4">Official hospitality — Club 58, Marina Views, South Club — for mixed seniority groups.</li>
            <li className="border-t border-border pt-4">Grandstand blocks when the brief is “get the team to the race”, not a lounge.</li>
            <li className="border-t border-border pt-4">Hotels on Yas Island, airport meet-and-greet and on-island cars.</li>
          </ul>
        </section>
        <section>
          <h2 className="display text-4xl">How a booking works</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Listed packages can be paid on the package page. For a private area, mixed inventory or Paddock Club variants, email {CONTACT_EMAIL} with the date and headcount — we come back with what is left and a written inclusion list.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {BRAND.credentials} Tickets are issued digitally by the promoter closer to race week.
          </p>
          <Link
            to={PATHS.packages}
            className="chevron-btn mt-8 inline-block bg-primary px-7 py-4 pr-10 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground"
          >
            Start with a package
          </Link>
        </section>
      </div>
    </GuideLayout>
  );
}
