import { createFileRoute, Link } from "@tanstack/react-router";

import { ContactUs } from "@/components/site/ContactUs";
import { Footer, Nav } from "@/components/site/parts";
import { pageHead } from "@/lib/seo";
import { BRAND, PATHS } from "@/lib/site";

export const Route = createFileRoute("/checkout/cancel")({
  validateSearch: (search: Record<string, unknown>) => ({
    slug: typeof search.slug === "string" ? search.slug : "",
  }),
  head: () =>
    pageHead({
      title: `Checkout cancelled | ${BRAND.shortName}`,
      description: "Your Abu Dhabi GP 2026 checkout was cancelled. No payment was taken.",
      path: "/checkout/cancel",
      noindex: true,
    }),
  component: CheckoutCancelPage,
});

function CheckoutCancelPage() {
  const { slug } = Route.useSearch();
  return (
    <div className="min-h-svh">
      <Nav solid />
      <section className="page-offset mx-auto max-w-3xl px-5 pb-28 md:px-10">
        <h1 className="display text-[clamp(2.25rem,6vw,4.5rem)]">Checkout cancelled</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          No payment was taken. Those seats are released again. You can go back and choose another day, or message us if you have a question.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          {slug ? (
            <Link to="/packages/$slug" params={{ slug }} className="font-display text-lg font-bold uppercase text-primary">
              Return to package →
            </Link>
          ) : (
            <Link to={PATHS.packages} className="font-display text-lg font-bold uppercase text-primary">
              View packages →
            </Link>
          )}
        </div>
        <div className="mt-12 max-w-md">
          <ContactUs />
        </div>
      </section>
      <Footer />
    </div>
  );
}
