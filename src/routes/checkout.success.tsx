import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ContactUs } from "@/components/site/ContactUs";
import { Footer, Nav } from "@/components/site/parts";
import { trackPurchase } from "@/lib/analytics";
import { confirmPaidCheckout, lookupCheckoutOrder } from "@/lib/checkout";
import { formatMoney } from "@/lib/crm-catalog";
import { pageHead } from "@/lib/seo";
import { BRAND, CONTACT_EMAIL, PATHS } from "@/lib/site";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () =>
    pageHead({
      title: `Order confirmed | ${BRAND.shortName}`,
      description: "Your Abu Dhabi GP 2026 booking is confirmed.",
      path: "/checkout/success",
      noindex: true,
    }),
  component: CheckoutSuccessPage,
});

type SuccessState = {
  status: "confirming" | "confirmed" | "pending";
  orderReference?: string;
  dealReference?: string | null;
  packageName?: string | null;
  day?: string | null;
  guests?: number;
  totalAmount?: number;
  currency?: string;
};

function CheckoutSuccessPage() {
  const { session_id: sessionId } = Route.useSearch();
  const [state, setState] = useState<SuccessState>({ status: sessionId ? "confirming" : "pending" });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const applyConfirmed = (result: {
      orderReference?: string;
      dealReference?: string | null;
      packageName?: string | null;
      day?: string | null;
      guests?: number;
      totalAmount?: number;
      currency?: string;
    }) => {
      if (cancelled || !result.orderReference) return false;
      setState({
        status: "confirmed",
        orderReference: result.orderReference,
        dealReference: result.dealReference,
        packageName: result.packageName,
        day: result.day,
        guests: result.guests,
        totalAmount: result.totalAmount,
        currency: result.currency,
      });
      trackPurchase({
        transactionId: result.orderReference,
        packageName: result.packageName || "Abu Dhabi GP package",
        guests: result.guests || 0,
        value: result.totalAmount || 0,
        currency: result.currency || "USD",
      });
      return true;
    };

    const run = async () => {
      const confirmed = await confirmPaidCheckout({ data: { sessionId } });
      if (cancelled) return;
      if (confirmed.ok && !confirmed.pending && applyConfirmed(confirmed)) return;

      for (let i = 0; i < 6; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (cancelled) return;
        const result = await lookupCheckoutOrder({ data: { sessionId } });
        if (result.ok && !result.pending && applyConfirmed(result)) return;
      }
      if (!cancelled) setState({ status: "pending" });
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const confirmed = state.status === "confirmed" && state.orderReference;

  return (
    <div>
      <Nav solid />
      <section className="mx-auto max-w-3xl px-5 py-28 md:px-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">✓</div>
        <h1 className="display mt-8 text-5xl md:text-7xl">{confirmed ? "Order confirmed" : state.status === "confirming" ? "Confirming your booking" : "Payment received"}</h1>
        {confirmed ? (
          <div className="mt-8 space-y-3 text-lg">
            <p className="text-muted-foreground">
              Thank you. We have received your payment and your Abu Dhabi GP booking is confirmed.
            </p>
            <div className="border border-border bg-card p-6">
              <div className="eyebrow text-muted-foreground">Booking reference</div>
              <div className="mt-2 font-display text-3xl">{state.orderReference}</div>
              {state.dealReference ? <div className="mt-1 text-sm text-muted-foreground">Deal {state.dealReference}</div> : null}
              <dl className="mt-6 space-y-2 text-base">
                {state.packageName ? (
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Package</dt>
                    <dd>{state.packageName}</dd>
                  </div>
                ) : null}
                {state.day ? (
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Days</dt>
                    <dd>{state.day}</dd>
                  </div>
                ) : null}
                {state.guests ? (
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Guests</dt>
                    <dd>{state.guests}</dd>
                  </div>
                ) : null}
                {state.totalAmount ? (
                  <div className="flex justify-between gap-6 border-t border-border pt-3 font-display text-2xl">
                    <dt>Total paid</dt>
                    <dd>{formatMoney(state.totalAmount, state.currency || "USD")}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <p className="text-muted-foreground">
              A confirmation email is on its way. Tickets are issued digitally closer to race week — keep this reference for your records.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-lg text-muted-foreground">
            {state.status === "confirming"
              ? "Your card payment went through. We are confirming the booking and will show your reference here in a moment."
              : `Your card payment went through. If your reference is not on this page yet, email ${CONTACT_EMAIL} with the name and email you paid with and we will confirm it.`}
          </p>
        )}
        <Link to={PATHS.packages} className="mt-10 inline-block font-display text-lg font-bold uppercase text-primary">
          Back to packages →
        </Link>
        <div className="mt-12 max-w-md">
          <ContactUs />
        </div>
      </section>
      <Footer />
    </div>
  );
}
