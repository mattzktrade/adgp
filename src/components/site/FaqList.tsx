import { useState } from "react";

import type { FaqItem } from "@/lib/packages";

export function FaqList({ faqs, defaultOpen = 0 }: { faqs: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={faq.q} className="border-t border-border last:border-b">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-6 py-6 text-left"
          >
            <span className="font-display text-xl font-semibold uppercase md:text-2xl">{faq.q}</span>
            <span className={`text-2xl text-primary transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
            <p className="overflow-hidden text-muted-foreground">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
