import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PackageMedia } from "@/components/site/PackageMedia";
import { PhoneField } from "@/components/site/PhoneField";
import { Countdown, Eyebrow, Footer, Nav, Reveal } from "@/components/site/parts";
import { dayOptionsFor, EVENT, getPackage, PACKAGES, TIERS } from "@/lib/packages";
import { submitAvailabilityRequest } from "@/lib/submit-enquiry";

export const Route = createFileRoute("/packages/$slug")({
  loader: ({ params }) => {
    const pkg = getPackage(params.slug);
    if (!pkg) throw notFound();
    return pkg;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Abu Dhabi GP 2026 | ZK Sports` },
          { name: "description", content: loaderData.sub },
          { property: "og:title", content: `${loaderData.name} — Abu Dhabi Grand Prix 2026` },
          { property: "og:description", content: loaderData.sub },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Package unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: PackagePage,
});

const FAQ_CLIPS = [
  { src: "/faq%201.mp4", title: "The experiences" },
  { src: "/faq%202.mp4", title: "Groups and tickets" },
  { src: "/faq%203.mp4", title: "Official access" },
];

const FAQS: [string, string][] = [
  ["What's included in the price?", "Everything listed under 'The experience' is included for each day you book. Your consultant will confirm the exact inclusions in writing before you pay."],
  ["Can I book for a group or a company?", "Yes. We regularly host corporate groups, from a single table to a private area. Tell us your numbers and we'll put together options."],
  ["How do tickets arrive?", "Tickets are issued digitally by the promoter closer to race week. Your consultant will send you the access details and arrival guidance."],
  ["Can you arrange hotels and transfers?", "Yes. We can add Yas Island hotels, airport transfers and on-island transport to any package."],
  ["Is there a dress code?", "Smart casual is the norm across hospitality. Comfortable shoes are recommended — circuits involve plenty of walking."],
];

const WEEKEND = [
  ["Thu 03", "Fanzone opens", "After-race concert"],
  ["Fri 04", "Free practice", "After-race concert"],
  ["Sat 05", "Qualifying", "After-race concert"],
  ["Sun 06", "Grand Prix · 17:00", "Season finale"],
];

function PackagePage() {
  const p = Route.useLoaderData();
  const dayOptions = dayOptionsFor(p.slug);
  const [sent, setSent] = useState(false);
  const [day, setDay] = useState(dayOptions[0]!);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setDay(dayOptionsFor(p.slug)[0]!);
    setSent(false);
    setError(null);
  }, [p.slug]);
  const [open, setOpen] = useState<number | null>(0);
  const related = PACKAGES.filter((x) => x.slug !== p.slug && x.tier === p.tier).concat(PACKAGES.filter((x) => x.tier !== p.tier)).slice(0, 3);
  const field = "w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

  return (
    <div className="pb-20 md:pb-0">
      <Nav solid />

      {/* HERO */}
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
          />
        ) : (
          <img src={p.image} alt={p.name} className="absolute inset-0 h-full w-full scale-105 object-cover" />
        )}
        <div className="veil absolute inset-0" />
        <div className="veil-side absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-12 md:px-10 md:pb-16">
          <nav className="eyebrow mb-8 hidden md:flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Abu Dhabi 2026</Link>
            <span>/</span>
            <span>{TIERS[p.tier].short}</span>
            <span>/</span>
            <span className="text-foreground">{p.name}</span>
          </nav>
          <Eyebrow>{TIERS[p.tier].label}</Eyebrow>
          <h1 className="display mt-4 max-w-5xl text-[3.4rem] leading-[0.88] md:text-[7.5rem]">{p.name}</h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/80 md:text-xl">{p.sub}</p>
          <div className="mt-10 grid max-w-4xl grid-cols-2 border-t border-foreground/15 md:grid-cols-4">
            {[
              ["Location", p.where],
              ["Dates", EVENT.dates],
              ["Format", p.hosted ? "ZK hosted" : "Official"],
              ["Availability", "Limited"],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-foreground/15 py-4 pr-4 md:border-b-0">
                <div className="eyebrow text-muted-foreground">{k}</div>
                <div className="mt-1.5 text-sm md:text-base">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OVERVIEW + ENQUIRY */}
      <section className="mx-auto grid max-w-[1600px] gap-14 px-5 py-20 md:px-10 lg:grid-cols-[1fr_420px] lg:gap-20 lg:py-28">
        <div className="min-w-0">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 className="display mt-5 text-4xl md:text-6xl">{p.headline}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{p.description}</p>
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

          {/* Included */}
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

          {/* Weekend */}
          <div className="mt-24">
            <Eyebrow>Race weekend</Eyebrow>
            <h3 className="display mt-5 text-4xl md:text-5xl">Four days on Yas Island</h3>
            <div className="mt-10 grid border-l border-t border-border sm:grid-cols-2 md:grid-cols-4">
              {WEEKEND.map(([d, a, b], i) => (
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

        {/* Sticky enquiry */}
        <aside id="enquire" className="scroll-mt-28">
          <div className="lg:sticky lg:top-28">
            <div className="border border-border bg-card">
              <div className="kerb h-1 w-full" />
              <div className="p-7">
                {sent ? (
                  <div className="py-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">✓</div>
                    <div className="display mt-6 text-4xl">Request received</div>
                    <p className="mt-3 text-muted-foreground">A ZK hospitality consultant will be in touch shortly with availability for {p.name}.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (pending) return;
                      if (!phone) {
                        setError("Choose your country and enter your mobile number.");
                        return;
                      }
                      setPending(true);
                      setError(null);
                      try {
                        const result = await submitAvailabilityRequest({
                          data: {
                            slug: p.slug,
                            day,
                            fullName,
                            email,
                            phone,
                            guests: Number(guests),
                          },
                        });
                        if (!result.ok) {
                          setError(result.message);
                          return;
                        }
                        setSent(true);
                      } catch {
                        setError("We couldn't send that just now. Please try again in a moment.");
                      } finally {
                        setPending(false);
                      }
                    }}
                  >
                    <div className="eyebrow text-muted-foreground">Check availability</div>
                    <div className="display mt-2 text-3xl">{p.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">Price on request · Limited allocation</div>

                    <div className="mt-7 grid grid-cols-2 gap-2">
                      {dayOptions.map((d) => (
                        <button
                          type="button"
                          key={d}
                          disabled={pending}
                          onClick={() => setDay(d)}
                          className={`border px-3 py-2.5 text-sm transition-colors disabled:opacity-60 ${dayOptions.length === 1 ? "col-span-2" : ""} ${day === d ? "border-primary bg-primary/10 text-foreground" : "border-input text-muted-foreground hover:border-foreground/40"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 space-y-1">
                      <input required name="fullName" autoComplete="name" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
                      <input required type="email" name="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                      <PhoneField disabled={pending} fieldClassName={field} value={phone} onChange={setPhone} />
                      <input required type="number" name="guests" min={1} max={200} placeholder="Number of guests" value={guests} onChange={(e) => setGuests(e.target.value)} className={field} />
                    </div>

                    {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}

                    <button
                      disabled={pending}
                      className="chevron-btn mt-7 w-full bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      {pending ? "Sending…" : "Request availability"}
                    </button>
                    <p className="mt-4 text-center text-xs text-muted-foreground">No payment taken · No obligation</p>
                  </form>
                )}
              </div>
              <div className="border-t border-border p-7">
                <div className="eyebrow text-muted-foreground">Lights out in</div>
                <div className="mt-3"><Countdown compact /></div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 border border-border p-5 text-sm text-muted-foreground">
              <span className="mt-0.5 font-mono text-xs text-primary">ZK</span>
              <span>F1® Paddock Club™ Authorised Distributor and Yas Marina Circuit Official On-Seller.</span>
            </div>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-asphalt">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 pt-20 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:pt-28">
          <div>
            <Eyebrow>Good to know</Eyebrow>
            <h2 className="display mt-5 text-4xl md:text-6xl">Questions, answered</h2>
          </div>
          <div>
            {FAQS.map(([q, a], i) => (
              <div key={q} className="border-t border-border last:border-b">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="font-display text-xl font-semibold uppercase md:text-2xl">{q}</span>
                  <span className={`text-2xl text-primary transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden text-muted-foreground">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 px-5 pb-20 sm:grid-cols-3 md:px-10 lg:pb-28">
          {FAQ_CLIPS.map((clip) => (
            <figure key={clip.src}>
              <video
                src={clip.src}
                controls
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full bg-black object-cover"
              />
              <figcaption className="mt-3 eyebrow text-muted-foreground">{clip.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* RELATED */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Also at Yas Marina</Eyebrow>
            <h2 className="display mt-5 text-4xl md:text-6xl">Compare experiences</h2>
          </div>
          <Link to="/" hash="collection" className="eyebrow hidden text-muted-foreground hover:text-foreground md:block">View all →</Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/packages/$slug" params={{ slug: r.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4">
                <div>
                  <div className="eyebrow text-muted-foreground">{TIERS[r.tier].short} · {r.where}</div>
                  <div className="mt-2 font-display text-2xl font-bold uppercase">{r.name}</div>
                </div>
                <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-xl md:hidden">
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-bold uppercase">{p.name}</div>
          <div className="text-xs text-muted-foreground">Price on request</div>
        </div>
        <a href="#enquire" className="shrink-0 bg-primary px-5 py-3 font-display font-bold uppercase text-primary-foreground">Enquire</a>
      </div>
    </div>
  );
}
