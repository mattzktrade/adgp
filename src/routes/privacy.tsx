import { createFileRoute } from "@tanstack/react-router";

import { GuideLayout } from "@/components/site/PageChrome";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { BRAND, CONTACT_EMAIL, PATHS } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: `Privacy | ${BRAND.legalName}`,
      description: `How ${BRAND.legalName} uses the name, email, phone and guest details you send when you request Abu Dhabi Grand Prix 2026 availability.`,
      path: PATHS.privacy,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Abu Dhabi GP 2026", path: PATHS.home },
          { name: "Privacy", path: PATHS.privacy },
        ]),
      ],
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <GuideLayout
      eyebrow="Privacy"
      title="How we use your enquiry"
      lead={`When you request availability on this site, ${BRAND.legalName} uses the details you send to reply about Abu Dhabi Grand Prix 2026 tickets and hospitality. We do not take payment on the form.`}
      crumbs={[{ label: "Abu Dhabi 2026", to: "/" }, { label: "Privacy" }]}
    >
      <div className="max-w-2xl space-y-10 text-lg leading-relaxed text-muted-foreground">
        <section>
          <h2 className="display text-3xl text-foreground">What we collect</h2>
          <p className="mt-4">
            The availability form asks for your name, email, phone number, guest count, chosen package and day. We also
            store the time of the request so the consultant can follow up.
          </p>
        </section>
        <section>
          <h2 className="display text-3xl text-foreground">Why we collect it</h2>
          <p className="mt-4">
            To tell you whether the package is available, send a written quote, and arrange tickets, hotels or transfers
            if you ask us to. Submitting the form is consent to be contacted about that enquiry and related official
            hospitality for this event.
          </p>
        </section>
        <section>
          <h2 className="display text-3xl text-foreground">Where it goes</h2>
          <p className="mt-4">
            The enquiry is sent to our customer record system and assigned to a ZK hospitality consultant. We do not
            sell your details. We share them with fulfilment partners only when needed to deliver tickets, hotels or
            transport you have asked for.
          </p>
        </section>
        <section>
          <h2 className="display text-3xl text-foreground">How to reach us</h2>
          <p className="mt-4">
            Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline-offset-4 hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            to update or delete an enquiry, or to opt out of further marketing about this event.
          </p>
        </section>
      </div>
    </GuideLayout>
  );
}
