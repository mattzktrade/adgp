import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { ContactUs } from "@/components/site/ContactUs";
import { PhoneField } from "@/components/site/PhoneField";
import { trackBeginCheckout, trackGenerateLead } from "@/lib/analytics";
import { createCheckoutSession } from "@/lib/checkout";
import { availabilityLabel, formatMoney, type PackageOverlay } from "@/lib/crm-catalog";
import { dayOptionsFor, type Pkg } from "@/lib/packages";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_HREF, CONTACT_WHATSAPP_LABEL, PATHS } from "@/lib/site";
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
  const [guests, setGuests] = useState("1");
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
  const currency = selected?.currency || overlay.currency;
  const validGuests = Number.isInteger(guestCount) && guestCount > 0;
  const total = selected?.buyable && validGuests ? selected.unitPrice * guestCount : null;
  const stockLimit = canBuy && selected ? Math.max(1, Math.min(200, selected.sellable)) : null;
  const maxGuests = stockLimit ?? 200;
  const [limitHit, setLimitHit] = useState(false);

  useEffect(() => {
    setLimitHit(false);
    if (stockLimit !== null && Number(guests) > stockLimit) setGuests(String(stockLimit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockLimit]);

  const changeGuests = (next: number) => {
    if (stockLimit !== null && next > stockLimit) {
      setGuests(String(stockLimit));
      setLimitHit(true);
      return;
    }
    setLimitHit(false);
    setGuests(String(Math.min(200, Math.max(1, next))));
  };

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
              if (!validGuests) {
                setError("Enter how many guests you are booking for.");
                return;
              }
              setPending(true);
              setError(null);
              try {
                if (canBuy) {
                  trackBeginCheckout({ packageName: pkg.name, day, guests: guestCount, value: total ?? 0 });
                  const result = await createCheckoutSession({
                    data: {
                      slug: pkg.slug,
                      day,
                      fullName,
                      email,
                      phone,
                      guests: guestCount,
                    },
                  });
                  if (!result.ok) {
                    setError(result.message);
                    return;
                  }
                  window.location.href = result.url;
                  return;
                }
                if (checkoutEnabled) {
                  setError("This package is arranged with a consultant. Email or WhatsApp us and we will confirm what is left.");
                  return;
                }
                const result = await submitAvailabilityRequest({
                  data: {
                    slug: pkg.slug,
                    day,
                    fullName,
                    email,
                    phone,
                    guests: guestCount,
                  },
                });
                if (!result.ok) {
                  setError(result.message);
                  return;
                }
                trackGenerateLead({ packageName: pkg.name, day, guests: guestCount });
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
            {unitPrice ? (
              <div className="mt-5">
                <div className="font-display text-5xl leading-none">{formatMoney(unitPrice, currency)}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {canBuy ? `Per guest · ${day}` : "From, per guest"}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">
                {soldOut ? "This day is sold out" : "Live allocation · contact us for Paddock Club and sold-out dates"}
              </div>
            )}
            {selected ? (
              <div className="mt-2 text-sm text-muted-foreground">{availabilityLabel(selected.sellable, selected.buyable)}</div>
            ) : null}

            <div className="mt-7 grid grid-cols-2 gap-2">
              {dayOptions.map((d) => {
                const option = overlay.days.find((item) => item.day === d);
                return (
                  <button
                    type="button"
                    key={d}
                    disabled={pending}
                    onClick={() => setDay(d)}
                    className={`border px-3 py-3 text-left transition-colors disabled:opacity-60 ${dayOptions.length === 1 ? "col-span-2" : ""} ${day === d ? "border-primary bg-primary/10 text-foreground" : "border-input text-muted-foreground hover:border-foreground/40"}`}
                  >
                    <div className="text-sm">{d}</div>
                    {option?.buyable && option.unitPrice > 0 ? (
                      <div className="mt-1 font-display text-lg text-foreground">{formatMoney(option.unitPrice, option.currency)}</div>
                    ) : (
                      <div className="mt-1 text-xs">{option?.reason === "sold_out" ? "Sold out" : "Contact"}</div>
                    )}
                  </button>
                );
              })}
            </div>

            {canBuy || !checkoutEnabled ? (
              <div className="mt-4 space-y-1">
                <input required name="fullName" autoComplete="name" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
                <input required type="email" name="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                <PhoneField disabled={pending} fieldClassName={field} value={phone} onChange={setPhone} />
                <div className="flex items-end justify-between gap-4 border-b border-input py-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Guests</div>
                    <div className="mt-1 text-sm text-muted-foreground">How many people</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={pending || guestCount <= 1}
                      onClick={() => changeGuests(guestCount - 1)}
                      className="flex h-9 w-9 items-center justify-center border border-input text-lg disabled:opacity-40"
                      aria-label="Fewer guests"
                    >
                      −
                    </button>
                    <input
                      required
                      type="number"
                      name="guests"
                      min={1}
                      max={maxGuests}
                      value={guests}
                      onChange={(e) => {
                        const typed = Number(e.target.value);
                        if (stockLimit !== null && Number.isFinite(typed) && typed > stockLimit) {
                          setGuests(String(stockLimit));
                          setLimitHit(true);
                          return;
                        }
                        setLimitHit(false);
                        setGuests(e.target.value);
                      }}
                      className="w-14 bg-transparent text-center text-lg outline-none"
                    />
                    <button
                      type="button"
                      disabled={pending || guestCount >= 200 || (limitHit && guestCount >= maxGuests)}
                      onClick={() => changeGuests(guestCount + 1)}
                      className="flex h-9 w-9 items-center justify-center border border-input text-lg disabled:opacity-40"
                      aria-label="More guests"
                    >
                      +
                    </button>
                  </div>
                </div>
                {limitHit && stockLimit !== null ? (
                  <div className="mt-3 border border-primary/60 bg-primary/10 p-3 text-sm" role="status">
                    <p>
                      We only have {stockLimit} seat{stockLimit === 1 ? "" : "s"} available to book online for {day}. Need more? Contact us and we'll do our best to arrange it.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                        {CONTACT_EMAIL}
                      </a>
                      <a href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                        WhatsApp {CONTACT_WHATSAPP_LABEL}
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {canBuy && total ? (
              <div className="mt-6 border border-border p-4">
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {guestCount} guest{guestCount === 1 ? "" : "s"} · {day}
                  </span>
                  <span>{formatMoney(unitPrice || 0, currency)} each</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4 border-t border-border pt-3">
                  <span className="eyebrow text-muted-foreground">Total to pay</span>
                  <span className="font-display text-3xl leading-none">{formatMoney(total, currency)}</span>
                </div>
              </div>
            ) : null}

            {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}

            {canBuy ? (
              <button
                disabled={pending || !total}
                className="chevron-btn mt-7 w-full bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Opening checkout…" : total ? `Pay ${formatMoney(total, currency)} securely` : "Pay securely"}
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
