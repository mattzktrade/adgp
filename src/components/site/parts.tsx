import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EVENT, PACKAGES } from "@/lib/packages";
import { BRAND, PATHS } from "@/lib/site";
import { CredentialBadges } from "@/components/site/CredentialBadges";

const LOGO_SRC = "/ZK%20white%20logo.png";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={LOGO_SRC} alt="ZK Sports & Entertainment" className={`${className} w-auto`} />;
}

const NAV_LINKS = [
  { to: PATHS.packages, label: "Collection" },
  { to: PATHS.compare, label: "Compare" },
  { to: PATHS.guides, label: "Guides" },
  { to: PATHS.officialAccess, label: "Official access" },
] as const;

export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const filled = solid || scrolled || open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 overflow-x-hidden transition-all duration-500 ${
        filled ? "border-b border-border bg-background/80 backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-5 md:h-20 md:px-10">
        <Link to="/" aria-label="ZK Sports & Entertainment home" className="min-w-0" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-auto md:h-9" />
        </Link>
        <nav className="hidden items-center gap-8 eyebrow text-muted-foreground lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to={PATHS.packages}
            className="chevron-btn shrink-0 whitespace-nowrap bg-primary px-4 py-2 pr-6 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:translate-x-0.5 md:px-5 md:py-2.5 md:pr-7 md:text-base"
          >
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book your seat</span>
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-border text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="font-display text-lg">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-border bg-background px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-4 font-display text-2xl font-bold uppercase">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to={PATHS.corporate} onClick={() => setOpen(false)}>
              Corporate
            </Link>
            <Link to={PATHS.faq} onClick={() => setOpen(false)}>
              FAQ
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function useCountdown(target = EVENT.lightsOutUtc) {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setT({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff / 36e5) % 24),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1e3) % 60),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);
  return t;
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const t = useCountdown();
  const pad = (n?: number) => (n === undefined ? "--" : String(n).padStart(2, "0"));
  const cells = [
    ["Days", pad(t?.d)],
    ["Hrs", pad(t?.h)],
    ["Min", pad(t?.m)],
    ["Sec", pad(t?.s)],
  ];
  return (
    <div className={`flex min-w-0 items-end ${compact ? "gap-2.5" : "gap-2 sm:gap-3 md:gap-5"}`}>
      {cells.map(([l, v], i) => (
        <div key={l} className={`flex items-end ${compact ? "gap-2.5" : "gap-2 sm:gap-3 md:gap-5"}`}>
          <div>
            <div className={`font-mono font-medium tabular-nums ${compact ? "text-2xl" : "text-2xl sm:text-3xl md:text-5xl"}`}>{v}</div>
            <div className="eyebrow mt-1 text-muted-foreground">{l}</div>
          </div>
          {i < 3 && <span className={`pb-4 font-mono text-primary md:pb-5 ${compact ? "text-xl" : "text-lg sm:text-2xl md:text-4xl"}`}>:</span>}
        </div>
      ))}
    </div>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`eyebrow flex items-start gap-2.5 text-primary md:items-center md:gap-3 ${className}`}>
      <span className="mt-[0.35em] inline-block h-0 w-0 shrink-0 border-y-[5px] border-r-[7px] border-y-transparent border-r-primary md:mt-0" />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="kerb h-1.5 w-full" />
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] md:px-10">
        <div>
          <Logo className="h-10" />
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            {BRAND.legalName} is a Formula 1® Paddock Club™ Authorised Distributor and Yas Marina Circuit Official On-Seller.
          </p>
          <CredentialBadges variant="compact" className="mt-7" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow mb-4 text-muted-foreground">Packages</div>
          {PACKAGES.map((pkg) => (
            <Link key={pkg.slug} to="/packages/$slug" params={{ slug: pkg.slug }} className="block hover:text-primary">
              {pkg.name}
            </Link>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow mb-4 text-muted-foreground">Explore</div>
          <Link to={PATHS.compare} className="block hover:text-primary">Compare hospitality</Link>
          <Link to={PATHS.guides} className="block hover:text-primary">Guides</Link>
          <Link to={PATHS.paddockClub} className="block hover:text-primary">Paddock Club</Link>
          <Link to={PATHS.seats} className="block hover:text-primary">Yas Marina seats</Link>
          <Link to={PATHS.howToBuy} className="block hover:text-primary">How to buy</Link>
          <Link to={PATHS.corporate} className="block hover:text-primary">Corporate</Link>
          <Link to={PATHS.officialAccess} className="block hover:text-primary">Official access</Link>
          <Link to={PATHS.faq} className="block hover:text-primary">FAQ</Link>
          <Link to={PATHS.privacy} className="block hover:text-primary">Privacy</Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow mb-4 text-muted-foreground">Event</div>
          <div>{EVENT.name}</div>
          <div className="text-muted-foreground">{EVENT.circuit}</div>
          <div className="font-mono text-muted-foreground">Race {EVENT.dates}</div>
          <div className="text-xs text-muted-foreground">Fanzone from {EVENT.fanOpens}</div>
          <a
            href="mailto:info@zk-sports.com?subject=Abu%20Dhabi%20Grand%20Prix%202026"
            className="mt-4 block hover:text-primary"
          >
            info@zk-sports.com
          </a>
          <a href={BRAND.parentUrl} className="block hover:text-primary">zk-sports.com</a>
          <p className="text-xs text-muted-foreground">
            Session times follow the official 2026 schedule. Programme subject to change. Live prices on each package page.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center eyebrow text-muted-foreground">
        © 2026 {BRAND.legalName}
      </div>
    </footer>
  );
}
