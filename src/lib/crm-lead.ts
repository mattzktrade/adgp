import { dayOptionsFor, getPackage } from "@/lib/packages";

/** Sam Townsend. Marketing enquiries assigned here are picked up by the follow-up sequence. */
export const MARKETING_OWNER_EMAIL = "samantha@zk-sports.com";

const CRM_PACKAGE_STEM: Record<string, string> = {
  "skybridge-terrace": "Skybridge Terrace",
  "marsa-box": "Marsa Box by ZK",
  "velocity-terrace": "Velocity Terrace",
  "paddock-club": "Paddock Club",
  "club-58": "Club 58",
  "marina-views-brunch": "Marina Views Brunch",
  "south-club": "South Club",
  "south-grandstand": "South Grandstand Tickets",
  "north-grandstand": "North Grandstand Tickets",
  "west-grandstand": "West Grandstand Tickets",
};

/** Catalog title the CRM already uses, including the day the guest asked for. */
export function catalogPackageName(slug: string, day: string, publicName: string): string {
  const stem = CRM_PACKAGE_STEM[slug] ?? publicName;
  if (day === "Friday" || day === "Saturday" || day === "Sunday") return `${day} ${stem}`;
  return `3 Day ${stem}`;
}

export type AvailabilityLeadInput = {
  slug: string;
  day: string;
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  leadId: string;
  createdAt: string;
};

export function buildAvailabilityLead(input: AvailabilityLeadInput) {
  const pkg = getPackage(input.slug);
  if (!pkg) return { ok: false as const, message: "That package is not available." };
  const days = dayOptionsFor(pkg.slug);
  if (!days.includes(input.day)) return { ok: false as const, message: "Choose one of the available days." };
  const guests = Math.floor(input.guests);
  if (!Number.isFinite(guests) || guests < 1 || guests > 200) {
    return { ok: false as const, message: "Enter the number of guests." };
  }
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  if (!fullName) return { ok: false as const, message: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false as const, message: "Enter a valid email." };
  if (phone.replace(/\D/g, "").length < 8) return { ok: false as const, message: "Enter a phone number with the country code." };

  return {
    ok: true as const,
    body: {
      leadId: input.leadId,
      createdAt: input.createdAt,
      origin: "website",
      ownerEmail: MARKETING_OWNER_EMAIL,
      campaign: {
        name: "Abu Dhabi GP 2026 website",
        formName: "Check availability",
      },
      contact: {
        fullName,
        email,
        phone,
      },
      interest: {
        package: catalogPackageName(pkg.slug, input.day, pkg.name),
        quantity: guests,
        event: "Abu Dhabi Grand Prix 2026",
      },
      answers: [
        { question: "Days", answer: input.day },
        { question: "Number of guests", answer: String(guests) },
      ],
      consent: {
        marketingOptIn: true,
      },
    },
  };
}
