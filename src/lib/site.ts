/** Production host for this app. Override in env when DNS is pointed. */
const rawSiteUrl = (import.meta.env["VITE_SITE_URL"] as string | undefined)?.trim();

export const SITE_URL = (rawSiteUrl || "https://abudhabi.zk-sports.com").replace(/\/$/, "");

export const BRAND = {
  legalName: "ZK Sports & Entertainment",
  shortName: "ZK Sports",
  collection: "ZK Hospitality Collection",
  description:
    "Official Abu Dhabi Grand Prix 2026 hospitality and tickets from ZK Sports & Entertainment — an F1® Paddock Club™ Authorised Distributor and Yas Marina Circuit Official On-Seller.",
  credentials:
    "F1® Paddock Club™ Authorised Distributor and Yas Marina Circuit Official On-Seller.",
  parentUrl: "https://www.zk-sports.com",
  onsellerListUrl: "https://www.yasmarinacircuit.com/en/onsellers",
  logoPath: "/ZK%20white%20logo.png",
  defaultOgPath: "/gallery/skybridge-181.jpg",
  defaultOgAlt: "Skybridge Terrace over Yas Marina Circuit at the Abu Dhabi Grand Prix",
  responseTime: "one working day",
  sameAs: ["https://www.zk-sports.com", "https://www.yasmarinacircuit.com/en/onsellers"],
} as const;

export const PATHS = {
  home: "/",
  packages: "/packages",
  compare: "/compare",
  guides: "/guides",
  paddockClub: "/guides/paddock-club",
  seats: "/guides/yas-marina-seats",
  howToBuy: "/guides/how-to-buy",
  corporate: "/corporate",
  officialAccess: "/official-access",
  faq: "/faq",
  privacy: "/privacy",
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalised}`;
}

export function packagePath(slug: string): string {
  return `/packages/${slug}`;
}
