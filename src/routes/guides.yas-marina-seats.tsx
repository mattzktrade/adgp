import { createFileRoute } from "@tanstack/react-router";

import { GuideArticle } from "@/components/site/PageChrome";
import { GUIDES } from "@/lib/content";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

const guide = GUIDES.find((item) => item.path === PATHS.seats)!;

export const Route = createFileRoute("/guides/yas-marina-seats")({
  head: () =>
    pageHead({
      title: `${guide.title} | ${BRAND.shortName}`,
      description: guide.description,
      path: guide.path,
      image: guide.image,
      imageAlt: guide.imageAlt,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Guides", path: PATHS.guides },
          { name: "Yas Marina seats", path: guide.path },
        ]),
      ],
    }),
  component: () => <GuideArticle guide={guide} />,
});
