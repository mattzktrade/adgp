import { createFileRoute } from "@tanstack/react-router";

import { FaqList } from "@/components/site/FaqList";
import { GuideLayout } from "@/components/site/PageChrome";
import { FAQ_CLIPS, SHARED_FAQS } from "@/lib/content";
import { breadcrumbJsonLd, faqJsonLd, pageHead, videoJsonLd } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () =>
    pageHead({
      title: `Abu Dhabi GP 2026 FAQ | ${BRAND.shortName}`,
      description:
        "Official tickets, groups, hotels, dress code, Thursday vs race weekend, and how ZK Sports fulfils Abu Dhabi Grand Prix 2026 bookings. Live prices where we sell online.",
      path: PATHS.faq,
      jsonLd: [
        faqJsonLd(SHARED_FAQS),
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "FAQ", path: PATHS.faq },
        ]),
        ...FAQ_CLIPS.map((clip) =>
          videoJsonLd({
            name: clip.title,
            description: clip.caption,
            contentUrl: clip.src,
          }),
        ),
      ],
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <GuideLayout
      eyebrow="Questions answered"
      title="Abu Dhabi GP 2026 FAQ"
      lead={`${BRAND.legalName} sells official ${BRAND.collection} tickets and hospitality for the season finale at Yas Marina. These answers cover buying, tickets, groups and the weekend. Each package page has questions that apply only to that venue.`}
      crumbs={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "FAQ" }]}
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <p className="text-muted-foreground">
          {BRAND.credentials} Venue-specific questions live on the package pages. Shared buying questions live here so
          they are not copied ten times.
        </p>
        <FaqList faqs={SHARED_FAQS} />
      </div>
      <div className="mt-20">
        <h2 className="display text-[clamp(1.85rem,4vw,3.75rem)]">From the team</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FAQ_CLIPS.map((clip) => (
            <figure key={clip.src}>
              <video src={clip.src} controls playsInline preload="metadata" className="aspect-[9/16] w-full bg-black object-cover" />
              <figcaption className="mt-3">
                <div className="eyebrow text-muted-foreground">{clip.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{clip.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </GuideLayout>
  );
}
