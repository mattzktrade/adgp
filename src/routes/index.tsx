import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Countdown, Eyebrow, Footer, Nav, Reveal } from "@/components/site/parts";
import { CredentialBadges } from "@/components/site/CredentialBadges";
import { CircuitMap } from "@/components/site/CircuitMap";
import { EVENT, PACKAGES, TIERS, type Pkg, type Tier } from "@/lib/packages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abu Dhabi Grand Prix 2026 Hospitality | ZK Sports & Entertainment" },
      {
        name: "description",
        content:
          "Ten ways to experience the F1 season finale at Yas Marina Circuit, 4–6 Dec 2026. Paddock Club™, signature lounges and grandstands from ZK Sports.",
      },
      { property: "og:title", content: "Abu Dhabi Grand Prix 2026 — ZK Hospitality Collection" },
      { property: "og:description", content: "One circuit, ten locations. The F1 season finale at Yas Marina, 4–6 Dec 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const HERO_STILL = "/gallery/skybridge-181.jpg";
const CREDENTIALS_STILL = encodeURI("/west grandstand/ADGP_Web_West_Grandstand_1920x694px_V2.jpg");

function Index() {
  return (
    <div className="relative">
      <Nav />
      <Hero />
      <Ticker />
      <Race />
      <CircuitExplorer />
      <Collection />
      <Credentials />
      <Footer />
    </div>
  );
}

function Hero() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()),
      );
    t();
    const i = setInterval(t, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <section className="grain relative isolate overflow-hidden md:h-[100svh] md:min-h-[720px]">
      <img src={HERO_STILL} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover object-[72%_center] md:object-center" />
      <div className="veil absolute inset-0" />
      <div className="veil-side absolute inset-0" />
      <div className="scanlines absolute inset-0 opacity-60" />

      {/* HUD corners */}
      <div className="pointer-events-none absolute inset-x-5 top-24 hidden justify-between font-mono text-[11px] text-muted-foreground md:inset-x-10 md:flex">
        <span>24.4672°N · 54.6031°E</span>
        <span>
          YAS ISLAND <span className="text-foreground">{time || "--:--:--"}</span> GST
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-16 pt-[5.75rem] md:h-full md:justify-end md:px-10 md:pb-32 md:pt-28">
        <Eyebrow className="animate-rise max-w-full">Formula 1® · Season Finale · Round 24</Eyebrow>
        <h1 className="display mt-5 text-7xl leading-[0.86] md:mt-6 md:text-[8.2vw] xl:text-[7.75rem]">
          <span className="block animate-wipe">Abu Dhabi</span>
          <span className="block animate-wipe [animation-delay:150ms]">Grand Prix</span>
          <span className="block animate-wipe text-sand [animation-delay:300ms]">2026</span>
        </h1>
        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-xl animate-rise [animation-delay:400ms]">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Yas Marina Circuit · {EVENT.dates}. From the Paddock Club™ to a terrace built over the track — choose where you watch the championship decided.
            </p>
            <div className="mt-7 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <a href="#collection" className="chevron-btn w-full bg-primary px-5 py-3.5 pr-9 text-center font-display text-base font-bold uppercase tracking-wide text-primary-foreground transition-all [word-spacing:0.16em] hover:glow sm:w-auto sm:text-left md:px-7 md:py-4 md:pr-10 md:text-lg md:tracking-wider">
                Explore packages
              </a>
              <a href="#circuit" className="w-full border border-foreground/30 px-5 py-3.5 text-center font-display text-base font-bold uppercase tracking-wide backdrop-blur-sm transition-colors [word-spacing:0.16em] hover:border-foreground sm:w-auto sm:text-left md:px-7 md:py-4 md:text-lg md:tracking-wider">
                View the circuit
              </a>
            </div>
          </div>
          <div className="min-w-0 animate-rise [animation-delay:600ms]">
            <div className="eyebrow mb-3 max-w-full text-muted-foreground">Lights out · Sun 06 Dec · 17:00 GST</div>
            <Countdown />
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 eyebrow text-muted-foreground md:flex">
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-foreground to-transparent" />
      </div>
    </section>
  );
}

function Ticker() {
  const items = PACKAGES.map((p) => `${p.id} ${p.name}`);
  return (
    <div className="relative overflow-hidden border-y border-border bg-primary py-3 text-primary-foreground">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl font-bold uppercase tracking-wider">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="opacity-60">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const STATS = [
  ["5.281", "km lap"],
  ["58", "laps"],
  ["16", "turns"],
  ["17:00", "lights out GST"],
];

function Race() {
  return (
    <section id="race" className="relative overflow-hidden py-24 md:py-40">
      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Reveal>
            <Eyebrow>The Race</Eyebrow>
            <h2 className="display mt-6 text-6xl md:text-8xl">
              Day into <br />
              <span className="text-sand">night.</span>
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal delay={100}>
            <p className="text-xl leading-relaxed md:text-2xl">
              The season finale starts in the desert sun and finishes under floodlights, as the sky over Yas Island burns from amber to midnight blue.
            </p>
            <p className="mt-6 text-muted-foreground md:text-lg">
              It's where championships are settled, where drivers say goodbye, and where the after-parties last longer than the race. Superyachts line the marina, the W Hotel glows over the track, and the whole paddock comes out for one last weekend.
            </p>
          </Reveal>
        </div>
      </div>
      <div className="relative mx-auto mt-20 grid max-w-[1600px] grid-cols-2 border-t border-border px-5 md:mt-28 md:grid-cols-4 md:px-10">
        {STATS.map(([n, l], i) => (
          <Reveal key={l} delay={i * 80} className="border-b border-border py-8 pr-4 md:border-b-0 md:border-r md:py-10 md:pl-6 md:last:border-r-0 md:first:pl-0">
            <div className="display text-6xl md:text-8xl">{n}</div>
            <div className="eyebrow mt-3 text-muted-foreground">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CircuitExplorer() {
  const [sel, setSel] = useState<Pkg>(PACKAGES[0]!);
  return (
    <section id="circuit" className="relative bg-asphalt py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>The Circuit</Eyebrow>
            <h2 className="display mt-6 text-6xl md:text-8xl">
              One circuit. <br />
              Ten <span className="text-primary">locations.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Tap a marker to see where you'll be sitting — and what's waiting for you when you get there.
          </p>
        </Reveal>

        <div className="relative mt-10 md:mt-12">
          <div className="no-scrollbar flex snap-x gap-2 overflow-x-auto pb-1 lg:flex-wrap">
            {PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSel(p)}
                className={`snap-start shrink-0 border px-4 py-2 font-mono text-xs uppercase transition-colors ${
                  sel.id === p.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.id} · {p.name}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-asphalt to-transparent lg:hidden" />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] md:mt-8">
          <div className="relative border border-border bg-background p-3 md:p-8">
            <div className="absolute left-4 top-4 eyebrow text-muted-foreground">YMC · 5.281 KM · CLOCKWISE</div>
            <CircuitMap active={sel.id} onSelect={setSel} className="mt-6 w-full text-foreground" />
          </div>
          <div key={sel.id} className="relative flex flex-col overflow-hidden border border-border bg-background animate-rise [animation-duration:.6s]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={sel.image} alt={sel.name} className="h-full w-full object-cover" />
              <div className="veil-card absolute inset-0" />
              <div className="absolute bottom-4 left-5 font-mono text-sm text-primary">{TIERS[sel.tier].label}</div>
              <div className="absolute right-0 top-0 bg-primary px-3 py-2 font-mono text-sm text-primary-foreground">{sel.id}</div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="display text-5xl">{sel.name}</h3>
              <div className="eyebrow mt-2 text-sand">{sel.where}</div>
              <p className="mt-4 text-muted-foreground">{sel.sub}</p>
              <div className="mt-5 grid grid-cols-2 gap-px bg-border">
                {sel.stats.slice(0, 4).map((s) => (
                  <div key={s.k} className="bg-background p-3">
                    <div className="font-display text-xl font-bold uppercase">{s.k}</div>
                    <div className="text-xs text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/packages/$slug"
                params={{ slug: sel.slug }}
                className="chevron-btn mt-6 self-start bg-primary px-6 py-3 pr-9 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground"
              >
                See the package →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Collection() {
  const [tier, setTier] = useState<Tier | "all">("all");
  const list = PACKAGES.filter((p) => tier === "all" || p.tier === tier);
  return (
    <section id="collection" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>Hospitality Collection</Eyebrow>
            <h2 className="display mt-6 text-6xl md:text-8xl">
              Choose your <span className="text-sand">package.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "signature", "official", "grandstand"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`border px-4 py-2 eyebrow transition-colors ${
                  tier === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "All ten" : TIERS[t].short}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 divide-y divide-border border-y border-border">
          {list.map((p) => (
            <PackageRow key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageRow({ p }: { p: Pkg }) {
  return (
    <Link
      to="/packages/$slug"
      params={{ slug: p.slug }}
      className="group relative grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 py-6 md:grid-cols-[80px_1.4fr_1fr_1fr_auto] md:gap-8 md:py-9"
    >
      {/* mobile image */}
      <div className="col-span-2 aspect-[16/9] overflow-hidden md:hidden">
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <span className="font-mono text-sm text-primary">{p.id}</span>
      <h3 className="display text-4xl transition-transform duration-500 group-hover:translate-x-3 md:text-7xl">{p.name}</h3>
      <span className="col-span-2 eyebrow text-muted-foreground md:col-span-1">{p.where}</span>
      <span className="hidden text-sm text-muted-foreground md:block">{p.headline}</span>
      <span className="col-span-2 flex items-center gap-3 font-display text-lg font-bold uppercase md:col-span-1">
        <span className="text-sand">{p.hosted ? "Hosted by ZK" : TIERS[p.tier].short}</span>
        <span className="flex h-11 w-11 items-center justify-center border border-border transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          →
        </span>
      </span>
    </Link>
  );
}

function Credentials() {
  return (
    <section className="relative overflow-hidden">
      <img src={CREDENTIALS_STILL} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-5 py-24 md:grid-cols-2 md:px-10 md:py-36">
        <Reveal>
          <Eyebrow>Official access</Eyebrow>
          <h2 className="display mt-6 text-6xl md:text-8xl">
            Let's go <span className="text-primary">official.</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="self-end">
          <CredentialBadges />
          <p className="mt-6 text-muted-foreground">
            Trusted access, expert support and seamless delivery — prices and availability on request. Pick a package and we'll come back to you within one working day.
          </p>
          <a href="#collection" className="chevron-btn mt-8 inline-block bg-primary px-7 py-4 pr-10 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground">
            Check availability
          </a>
        </Reveal>
      </div>
    </section>
  );
}
