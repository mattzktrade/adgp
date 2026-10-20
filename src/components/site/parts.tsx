import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EVENT } from "@/lib/packages";
import { CredentialBadges } from "@/components/site/CredentialBadges";

const LOGO_SRC = "/ZK%20white%20logo.png";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={LOGO_SRC} alt="ZK Sports & Entertainment" className={`${className} w-auto`} />;
}

export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const filled = solid || scrolled;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        filled ? "border-b border-border bg-background/80 backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" aria-label="ZK Sports home">
          <Logo className="h-7 md:h-9" />
        </Link>
        <nav className="hidden items-center gap-8 eyebrow text-muted-foreground lg:flex">
          <a href="/#race" className="transition-colors hover:text-foreground">The Race</a>
          <a href="/#circuit" className="transition-colors hover:text-foreground">Circuit</a>
          <a href="/#collection" className="transition-colors hover:text-foreground">Collection</a>
        </nav>
        <a
          href="/#collection"
          className="chevron-btn bg-primary px-5 py-2.5 pr-7 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:translate-x-0.5 md:text-base"
        >
          Book your seat
        </a>
      </div>
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
    <div className="flex items-end gap-3 md:gap-5">
      {cells.map(([l, v], i) => (
        <div key={l} className="flex items-end gap-3 md:gap-5">
          <div>
            <div className={`font-mono font-medium tabular-nums ${compact ? "text-2xl" : "text-3xl md:text-5xl"}`}>{v}</div>
            <div className="eyebrow mt-1 text-muted-foreground">{l}</div>
          </div>
          {i < 3 && <span className={`pb-5 font-mono text-primary ${compact ? "text-xl" : "text-2xl md:text-4xl"}`}>:</span>}
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
    <div className={`eyebrow flex items-center gap-3 text-primary ${className}`}>
      <span className="inline-block h-0 w-0 border-y-[5px] border-r-[7px] border-y-transparent border-r-primary" />
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="kerb h-1.5 w-full" />
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <Logo className="h-10" />
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            A Formula 1® Paddock Club™ Authorised Distributor and Yas Marina Circuit Official On-Seller.
          </p>
          <CredentialBadges variant="compact" className="mt-7" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow mb-4 text-muted-foreground">Event</div>
          <div>{EVENT.name}</div>
          <div className="text-muted-foreground">{EVENT.circuit}</div>
          <div className="font-mono text-muted-foreground">{EVENT.dates}</div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="eyebrow mb-4 text-muted-foreground">Contact</div>
          <a href="https://zk-sports.com" className="block hover:text-primary">zk-sports.com</a>
          <p className="text-xs text-muted-foreground">
            Session times follow the official 2026 schedule. Programme subject to change. Prices and availability on request.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center eyebrow text-muted-foreground">
        © 2026 ZK Sports & Entertainment
      </div>
    </footer>
  );
}
