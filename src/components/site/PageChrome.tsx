import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Eyebrow, Footer, Nav, Reveal } from "@/components/site/parts";
import type { GuidePage } from "@/lib/content";
import { CONTACT_EMAIL, PATHS } from "@/lib/site";

export type Crumb = {
  label: string;
  to?:
    | "/"
    | "/packages"
    | "/compare"
    | "/guides"
    | "/guides/paddock-club"
    | "/guides/yas-marina-seats"
    | "/guides/how-to-buy"
    | "/corporate"
    | "/official-access"
    | "/faq"
    | "/privacy";
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap items-center gap-2 text-muted-foreground">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {i > 0 ? <span>/</span> : null}
          {item.to ? (
            <Link to={item.to} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function EnquireBand({
  title = "Book your seats",
  body = `Choose a package, pick the day and the number of guests, and pay securely online. Questions go to ${CONTACT_EMAIL} or WhatsApp.`,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="border-t border-border bg-asphalt">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-10 md:py-24">
        <div className="max-w-xl">
          <Eyebrow>Next step</Eyebrow>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.75rem)]">{title}</h2>
          <p className="mt-4 text-muted-foreground">{body}</p>
        </div>
        <Link
          to={PATHS.packages}
          className="chevron-btn bg-primary px-7 py-4 pr-10 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground"
        >
          View packages
        </Link>
      </div>
    </section>
  );
}

export function GuideLayout({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh">
      <Nav solid />
      <header className="border-b border-border">
        <div className="page-offset mx-auto max-w-[1600px] px-5 pb-14 md:px-10 md:pb-20">
          <Breadcrumbs items={crumbs} />
          <Eyebrow className="mt-8">{eyebrow}</Eyebrow>
          <h1 className="display mt-5 max-w-5xl text-[clamp(2.35rem,6.5vw,5.5rem)]">{title}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/85 md:text-xl">{lead}</p>
        </div>
      </header>
      <article>
        <Reveal className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">{children}</Reveal>
      </article>
      <EnquireBand />
      <Footer />
    </div>
  );
}

export function GuideArticle({ guide }: { guide: GuidePage }) {
  return (
    <GuideLayout
      eyebrow={guide.eyebrow}
      title={guide.title}
      lead={guide.lead}
      crumbs={[
        { label: "Abu Dhabi 2026", to: "/" },
        { label: "Guides", to: "/guides" },
        { label: guide.eyebrow },
      ]}
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-12">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="display text-3xl md:text-5xl">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-6 space-y-3">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-4 border-t border-border py-3">
                      <span className="text-primary">/</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
        <aside>
          <img src={guide.image} alt={guide.imageAlt} className="aspect-[4/5] w-full object-cover" />
          <p className="mt-3 text-sm text-muted-foreground">{guide.imageAlt}</p>
        </aside>
      </div>
    </GuideLayout>
  );
}
