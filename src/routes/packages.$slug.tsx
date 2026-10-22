import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckoutPanel } from "@/components/site/CheckoutPanel";
import { FaqList } from "@/components/site/FaqList";
import { Breadcrumbs } from "@/components/site/PageChrome";
import { PackageMedia } from "@/components/site/PackageMedia";
import { Countdown, Eyebrow, Footer, Nav, Reveal } from "@/components/site/parts";
import { availabilityLabel, formatMoney, preferredDayPrice } from "@/lib/crm-catalog";
import { loadPackageStorefront } from "@/lib/storefront";
import { EVENT, getPackage, PACKAGES, relatedGuideFor, TIERS } from "@/lib/packages";
import { breadcrumbJsonLd, faqJsonLd, pageHead, productJsonLd, videoJsonLd } from "@/lib/seo";
import { BRAND, PATHS, packagePath } from "@/lib/site";

export const Route = createFileRoute("/packages/$slug")({
  loader: async ({ params }) => {
    const pkg = getPackage(params.slug);
    if (!pkg) throw notFound();
    const storefront = await loadPackageStorefront({ data: { slug: pkg.slug } });
    return { pkg, overlay: storefront.overlay, checkoutEnabled: storefront.checkoutEnabled };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.pkg.name} hospitality — Abu Dhabi GP 2026 | ${BRAND.shortName}`,
          description: loaderData.pkg.metaDescription,
          path: packagePath(loaderData.pkg.slug),
          image: loaderData.pkg.image,
          imageAlt: `${loaderData.pkg.name} at ${EVENT.circuit}`,
          jsonLd: [
            productJsonLd(loaderData.pkg, loaderData.overlay),
            faqJsonLd(loaderData.pkg.faqs),
            breadcrumbJsonLd([
              { name: "Abu Dhabi GP 2026", path: PATHS.home },
              { name: "Packages", path: PATHS.packages },
              { name: loaderData.pkg.name, path: packagePath(loaderData.pkg.slug) },
            ]),
            ...(loaderData.pkg.reel && loaderData.pkg.filmCaption
              ? [
                  videoJsonLd({
                    name: `${loaderData.pkg.name} at ${EVENT.name}`,
                    description: loaderData.pkg.filmCaption,
                    contentUrl: loaderData.pkg.reel,
                    thumbnailUrl: loaderData.pkg.reelPoster || loaderData.pkg.image,
                  }),
                ]
              : []),
          ],
        })
      : pageHead({
          title: "Package unavailable",
          description: "That hospitality package is not available.",
          path: PATHS.packages,
          noindex: true,
        }),
  component: PackagePage,
});

function PackagePage() {
  const { pkg: p, overlay, checkoutEnabled } = Route.useLoaderData();
  const guide = relatedGuideFor(p);
  const related = PACKAGES.filter((x) => x.slug !== p.slug && x.tier === p.tier)
    .concat(PACKAGES.filter((x) => x.tier !== p.tier))
    .slice(0, 3);
  const heroPrice = preferredDayPrice(overlay);
  const availabilityText = heroPrice
    ? `${formatMoney(heroPrice.amount, heroPrice.currency)} · ${availabilityLabel(heroPrice.sellable, heroPrice.buyable)}`
    : overlay.anyBuyable
      ? availabilityLabel(Math.max(...overlay.days.map((d) => d.sellable), 0), true)
      : p.slug === "paddock-club"
        ? "Contact us"
        : "Limited allocation";

  return (
    <div className="pb-20 md:pb-0">
      <Nav solid />

      <section className="relative flex min-h-[82svh] items-end overflow-hidden pt-20">
        {p.video ? (
          <video
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            src={p.video}
            poster={p.image}
            autoPlay
            muted
            loop
            playsInline
            aria-label={`${p.name} at ${EVENT.circuit}`}
          />
        ) : (
          <img src={p.image} alt={`${p.name} at ${EVENT.circuit}`} className="absolute inset-0 h-full w-full scale-105 object-cover" />
        )}
        <div className="veil absolute inset-0" />
        <div className="veil-side absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-12 md:px-10 md:pb-16">
          <div className="mb-8 hidden md:block">
            <Breadcrumbs
              items={[
                { label: "Abu Dhabi 2026", to: "/" },
                { label: "Packages", to: "/packages" },
                { label: p.name },
              ]}
            />
          </div>
          <Eyebrow>{TIERS[p.tier].label}</Eyebrow>
          <h1 className="display mt-4 max-w-5xl text-[3.4rem] leading-[0.88] md:text-[7.5rem]">{p.name}</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/85 md:text-xl">{p.lead}</p>
          <div className="mt-10 grid max-w-4xl grid-cols-2 border-t border-foreground/15 md:grid-cols-4">
            {[
              ["Location", p.where],
              ["Race days", EVENT.dates],
              ["Format", p.hosted ? "ZK hosted" : "Official"],
              ["Availability", availabilityText],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-foreground/15 py-4 pr-4 md:border-b-0">
                <div className="eyebrow text-muted-foreground">{k}</div>
                <div className="mt-1.5 text-sm md:text-base">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-14 px-5 py-20 md:px-10 lg:grid-cols-[1fr_420px] lg:gap-20 lg:py-28">
        <div className="min-w-0">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 className="display mt-5 text-4xl md:text-6xl">{p.headline}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{p.description}</p>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Best for {p.bestFor.charAt(0).toLowerCase() + p.bestFor.slice(1)}. {p.daysLabel}. {BRAND.credentials}
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
            {p.stats.map((s) => (
              <div key={s.k} className="border-b border-r border-border p-5 md:p-6">
                <div className="font-display text-3xl font-bold uppercase leading-none md:text-4xl">{s.k}</div>
                <div className="mt-3 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>

          <PackageMedia name={p.name} film={p.reel} filmPoster={p.reelPoster} photos={p.gallery} />
          {p.filmCaption ? <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{p.filmCaption}</p> : null}

          <div className="mt-24">
            <Eyebrow>The experience</Eyebrow>
            <h3 className="display mt-5 text-4xl md:text-5xl">What's included</h3>
            <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
              {p.included.map((it, i) => (
                <li key={it} className="flex gap-5 border-t border-border py-5">
                  <span className="pt-0.5 font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base md:text-lg">{it}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-24">
            <Eyebrow>Race weekend</Eyebrow>
            <h3 className="display mt-5 text-4xl md:text-5xl">Four days on Yas Island</h3>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Race sessions run {EVENT.raceWeekend}. Fanzone and after-race concerts open {EVENT.fanOpens}. Lights out is {EVENT.lightsOutLabel}.
            </p>
            <div className="mt-10 grid border-l border-t border-border sm:grid-cols-2 md:grid-cols-4">
              {EVENT.weekend.map(([d, a, b], i) => (
                <div key={d} className={`border-b border-r border-border p-6 ${i === 3 ? "bg-primary text-primary-foreground" : ""}`}>
                  <div className="font-mono text-xs opacity-70">{d}</div>
                  <div className="mt-6 font-display text-2xl font-bold uppercase leading-tight">{a}</div>
                  <div className="mt-1 text-sm opacity-70">{b}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Session times follow the official 2026 schedule and may change.</p>
          </div>
        </div>

        <aside id="enquire" className="scroll-mt-28">
          <div className="lg:sticky lg:top-28">
            <CheckoutPanel pkg={p} overlay={overlay} checkoutEnabled={checkoutEnabled} />
            <div className="mt-4 border border-border bg-card p-7">
              <div className="eyebrow text-muted-foreground">Lights out in</div>
              <div className="mt-3">
                <Countdown compact />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 border border-border p-5 text-sm text-muted-foreground">
              <span className="mt-0.5 font-mono text-xs text-primary">ZK</span>
              <span>{BRAND.credentials}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <Link to={PATHS.compare} className="block text-muted-foreground hover:text-foreground">
                Compare all ten venues →
              </Link>
              <Link to={guide.path} className="block text-muted-foreground hover:text-foreground">
                {guide.label} →
              </Link>
              <Link to={PATHS.faq} className="block text-muted-foreground hover:text-foreground">
                Shared questions →
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-border bg-asphalt">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <div>
            <Eyebrow>Good to know</Eyebrow>
            <h2 className="display mt-5 text-4xl md:text-6xl">Questions about {p.name}</h2>
            <p className="mt-4 text-muted-foreground">
              Ticket delivery, groups, hotels and dress code sit on the{" "}
              <Link to={PATHS.faq} className="text-foreground underline-offset-4 hover:underline">
                FAQ
              </Link>
              .
            </p>
          </div>
          <FaqList faqs={p.faqs} />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Also at Yas Marina</Eyebrow>
            <h2 className="display mt-5 text-4xl md:text-6xl">Compare experiences</h2>
          </div>
          <Link to={PATHS.compare} className="eyebrow hidden text-muted-foreground hover:text-foreground md:block">
            View all →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/packages/$slug" params={{ slug: r.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={`${r.name} at ${EVENT.circuit}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4">
                <div>
                  <div className="eyebrow text-muted-foreground">
                    {TIERS[r.tier].short} · {r.where}
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold uppercase">{r.name}</div>
                </div>
                <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-xl md:hidden">
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-bold uppercase">{p.name}</div>
          <div className="text-xs text-muted-foreground">
            {heroPrice ? formatMoney(heroPrice.amount, heroPrice.currency) : p.slug === "paddock-club" ? "Contact us" : "Limited allocation"}
          </div>
        </div>
        <a href="#enquire" className="shrink-0 bg-primary px-5 py-3 font-display font-bold uppercase text-primary-foreground">
          {checkoutEnabled && overlay.anyBuyable ? "Buy" : "Contact"}
        </a>
      </div>
    </div>
  );
}
