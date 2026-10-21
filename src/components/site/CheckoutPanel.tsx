import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { ContactUs } from "@/components/site/ContactUs";
import { PhoneField } from "@/components/site/PhoneField";
import { trackBeginCheckout, trackGenerateLead } from "@/lib/analytics";
import { createCheckoutSession } from "@/lib/checkout";
import { availabilityLabel, formatMoney, type PackageOverlay } from "@/lib/crm-catalog";
import { dayOptionsFor, type Pkg } from "@/lib/packages";
import { PATHS } from "@/lib/site";
import { submitAvailabilityRequest } from "@/lib/submit-enquiry";

const field =
  "w-full border-b border-input bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

export function CheckoutPanel({
  pkg,
  overlay,
  checkoutEnabled,
}: {
  pkg: Pkg;
  overlay: PackageOverlay;
  checkoutEnabled: boolean;
}) {
  const dayOptions = dayOptionsFor(pkg.slug);
  const [day, setDay] = useState(dayOptions[0]!);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setDay(dayOptionsFor(pkg.slug)[0]!);
    setSent(false);
    setError(null);
  }, [pkg.slug]);

  const selected = useMemo(() => overlay.days.find((item) => item.day === day) ?? null, [overlay.days, day]);
  const guestCount = Number(guests);
  const canBuy = checkoutEnabled && Boolean(selected?.buyable) && pkg.slug !== "paddock-club";
  const soldOut = Boolean(selected && !selected.buyable && selected.reason === "sold_out");
  const unitPrice = selected?.buyable ? selected.unitPrice : overlay.fromPrice;
  const total = selected?.buyable && guestCount > 0 ? selected.unitPrice * guestCount : null;

  return (
    <div className="border border-border bg-card">
      <div className="kerb h-1 w-full" />
      <div className="p-7">
        {sent ? (
          <div className="py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">✓</div>
            <div className="display mt-6 text-4xl">Request received</div>
            <p className="mt-3 text-muted-foreground">
              A ZK hospitality consultant will be in touch shortly with availability for {pkg.name}.
            </p>
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
                if (canBuy) {
                  trackBeginCheckout({ packageName: pkg.name, day, guests: Number(guests), value: total ?? 0 });
                  const result = await createCheckoutSession({
                    data: {
                      slug: pkg.slug,
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
                  window.location.href = result.url;
                  return;
                }
                const result = await submitAvailabilityRequest({
                  data: {
                    slug: pkg.slug,
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
                trackGenerateLead({ packageName: pkg.name, day, guests: Number(guests) });
                setSent(true);
              } catch {
                setError("We couldn't send that just now. Please try again in a moment.");
              } finally {
                setPending(false);
              }
            }}
          >
            <div className="eyebrow text-muted-foreground">{canBuy ? "Buy your seats" : soldOut ? "Sold out" : "Get in touch"}</div>
            <div className="display mt-2 text-3xl">{pkg.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {unitPrice
                ? `${formatMoney(unitPrice, selected?.currency || overlay.currency)}${canBuy ? " per guest" : " from"}`
                : soldOut
                  ? "This day is sold out"
                  : "Live allocation · contact us for Paddock Club and sold-out dates"}
            </div>
            {selected ? (
              <div className="mt-2 text-sm text-muted-foreground">{availabilityLabel(selected.sellable, selected.buyable)}</div>
            ) : null}

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

            {canBuy || !checkoutEnabled ? (
              <div className="mt-4 space-y-1">
                <input required name="fullName" autoComplete="name" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
                <input required type="email" name="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                <PhoneField disabled={pending} fieldClassName={field} value={phone} onChange={setPhone} />
                <input required type="number" name="guests" min={1} max={200} placeholder="Number of guests" value={guests} onChange={(e) => setGuests(e.target.value)} className={field} />
              </div>
            ) : null}

            {total && canBuy ? (
              <div className="mt-5 text-sm">
                Total {formatMoney(total, selected?.currency || overlay.currency)} for {guestCount} guest{guestCount === 1 ? "" : "s"}
              </div>
            ) : null}

            {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}

            {canBuy ? (
              <button
                disabled={pending}
                className="chevron-btn mt-7 w-full bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Opening checkout…" : "Pay securely"}
              </button>
            ) : checkoutEnabled ? (
              <p className="mt-7 text-sm text-muted-foreground">
                {soldOut
                  ? "This allocation is gone. Message us if you want a waitlist or another day."
                  : "This package is arranged with a consultant. Email or WhatsApp us and we will confirm what is left."}
              </p>
            ) : (
              <button
                disabled={pending}
                className="chevron-btn mt-7 w-full bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Sending…" : "Request availability"}
              </button>
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {canBuy ? "Secure card payment · Instant confirmation · " : "No obligation · "}
              <Link to={PATHS.privacy} className="underline-offset-2 hover:underline">
                Privacy
              </Link>
            </p>
          </form>
        )}
        <ContactUs />
      </div>
    </div>
  );
}
