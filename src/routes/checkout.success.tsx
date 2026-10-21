import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ContactUs } from "@/components/site/ContactUs";
import { Footer, Nav } from "@/components/site/parts";
import { trackPurchase } from "@/lib/analytics";
import { lookupCheckoutOrder } from "@/lib/checkout";
import { formatMoney } from "@/lib/crm-catalog";
import { pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () =>
    pageHead({
      title: `Booking received | ${BRAND.shortName}`,
      description: "Your Abu Dhabi GP 2026 payment was received.",
      path: "/checkout/success",
      noindex: true,
    }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { session_id: sessionId } = Route.useSearch();
  const [state, setState] = useState<{
    pending: boolean;
    orderReference?: string;
    packageName?: string | null;
    guests?: number;
    totalAmount?: number;
    currency?: string;
  }>({ pending: true });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const poll = async () => {
      for (let i = 0; i < 8; i += 1) {
        const result = await lookupCheckoutOrder({ data: { sessionId } });
        if (cancelled) return;
        if (result.ok && !result.pending) {
          setState({
            pending: false,
            orderReference: result.orderReference,
            packageName: result.packageName,
            guests: result.guests,
            totalAmount: result.totalAmount,
            currency: result.currency,
          });
          trackPurchase({
            transactionId: result.orderReference || sessionId,
            packageName: result.packageName || "Abu Dhabi GP package",
            guests: result.guests || 0,
            value: result.totalAmount || 0,
            currency: result.currency || "USD",
          });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      if (!cancelled) setState({ pending: true });
    };
    void poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div>
      <Nav solid />
      <section className="mx-auto max-w-3xl px-5 py-28 md:px-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">✓</div>
        <h1 className="display mt-8 text-5xl md:text-7xl">Payment received</h1>
        {state.orderReference ? (
          <p className="mt-6 text-lg text-muted-foreground">
            Booking {state.orderReference}
            {state.packageName ? ` · ${state.packageName}` : ""}
            {state.guests ? ` · ${state.guests} guests` : ""}
            {state.totalAmount ? ` · ${formatMoney(state.totalAmount, state.currency || "USD")}` : ""}.
          </p>
        ) : (
          <p className="mt-6 text-lg text-muted-foreground">
            Your card payment went through. We are confirming the booking now — a reference will appear here in a moment, and Stripe will email your receipt.
          </p>
        )}
        <p className="mt-4 text-muted-foreground">
          Keep an eye on your inbox for the Stripe receipt. Our team has the booking and will follow up with guest details closer to race week.
        </p>
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
