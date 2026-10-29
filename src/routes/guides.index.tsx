import { createFileRoute, Link } from "@tanstack/react-router";

import { GuideLayout } from "@/components/site/PageChrome";
import { GUIDE_HUB_LEAD, GUIDES } from "@/lib/content";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/guides/")({
  head: () =>
    pageHead({
      title: `Abu Dhabi GP 2026 guides | ${BRAND.shortName}`,
      description: GUIDE_HUB_LEAD,
      path: PATHS.guides,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Guides", path: PATHS.guides },
        ]),
      ],
    }),
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <GuideLayout
      eyebrow="Decide with facts"
      title="Abu Dhabi GP 2026 guides"
      lead={GUIDE_HUB_LEAD}
      crumbs={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "Guides" }]}
    >
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {GUIDES.map((guide) => (
          <Link key={guide.path} to={guide.path} className="group block border border-border">
            <img src={guide.image} alt={guide.imageAlt} className="aspect-[16/10] w-full object-cover" />
            <div className="p-6">
              <div className="eyebrow text-muted-foreground">{guide.eyebrow}</div>
              <h2 className="display mt-3 text-3xl group-hover:text-primary">{guide.title}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{guide.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </GuideLayout>
  );
}
