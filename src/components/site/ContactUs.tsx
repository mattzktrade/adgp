import { CONTACT_EMAIL, CONTACT_WHATSAPP_HREF, CONTACT_WHATSAPP_LABEL } from "@/lib/site";

export function ContactUs({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "border-t border-border pt-6"}>
      <div className="eyebrow text-muted-foreground">Have a question?</div>
      <p className="mt-2 text-sm text-muted-foreground">Contact us now — we reply on email and WhatsApp.</p>
      <div className="mt-4 space-y-2 text-sm">
        <a href={`mailto:${CONTACT_EMAIL}`} className="block text-foreground underline-offset-4 hover:underline">
          {CONTACT_EMAIL}
        </a>
        <a
          href={CONTACT_WHATSAPP_HREF}
          target="_blank"
          rel="noreferrer"
          className="block text-foreground underline-offset-4 hover:underline"
        >
          WhatsApp {CONTACT_WHATSAPP_LABEL}
        </a>
      </div>
    </div>
  );
}
