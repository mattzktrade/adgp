import type { PackageOverlay } from "@/lib/crm-catalog";
import { EVENT, PACKAGES, TIERS, type FaqItem, type Pkg } from "@/lib/packages";
import { BRAND, PATHS, SITE_URL, absoluteUrl, packagePath } from "@/lib/site";

export type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
};

export function pageHead({ title, description, path, image, imageAlt, noindex, jsonLd }: PageHeadInput) {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || BRAND.defaultOgPath);
  const ogAlt = imageAlt || BRAND.defaultOgAlt;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: ogAlt },
      { property: "og:site_name", content: BRAND.legalName },
      { property: "og:locale", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: (jsonLd ?? []).map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.legalName,
    url: SITE_URL,
    logo: absoluteUrl(BRAND.logoPath),
    description: BRAND.description,
    sameAs: [...BRAND.sameAs],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${BRAND.legalName} — ${EVENT.name}`,
    description: BRAND.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-GB",
  };
}

export function eventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${SITE_URL}/#event`,
    name: EVENT.officialName,
    description: `${EVENT.name} at ${EVENT.circuit}. Race weekend ${EVENT.raceWeekend}. Fanzone and after-race concerts from ${EVENT.fanOpens}. Official hospitality and tickets from ${BRAND.legalName}.`,
    startDate: EVENT.startDate,
    endDate: EVENT.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [absoluteUrl(BRAND.defaultOgPath)],
    location: {
      "@type": "Place",
      name: EVENT.circuit,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Yas Island",
        addressLocality: "Abu Dhabi",
        addressCountry: "AE",
      },
    },
    organizer: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      url: absoluteUrl(PATHS.packages),
      availability: "https://schema.org/LimitedAvailability",
      priceCurrency: "USD",
      description: "Live prices and availability for official and ZK-hosted hospitality.",
      offerCount: PACKAGES.length,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function productJsonLd(pkg: Pkg, overlay?: PackageOverlay) {
  const buyable = overlay?.days.find((day) => day.buyable && day.unitPrice > 0);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(packagePath(pkg.slug))}#product`,
    name: `${pkg.name} — ${EVENT.name}`,
    description: pkg.metaDescription,
    image: [absoluteUrl(pkg.image)],
    brand: { "@id": `${SITE_URL}/#organization` },
    category: TIERS[pkg.tier].label,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(packagePath(pkg.slug)),
      availability: buyable
        ? "https://schema.org/InStock"
        : overlay && !overlay.anyBuyable
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/LimitedAvailability",
      priceCurrency: buyable?.currency || "USD",
      ...(buyable
        ? { price: buyable.unitPrice }
        : { description: pkg.slug === "paddock-club" ? "Contact us for availability." : "Sold out or contact us for this package." }),
      eligibleDuration: pkg.daysLabel,
    },
  };
}

export function videoJsonLd(input: { name: string; description: string; contentUrl: string; thumbnailUrl?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    contentUrl: absoluteUrl(input.contentUrl),
    thumbnailUrl: input.thumbnailUrl ? [absoluteUrl(input.thumbnailUrl)] : undefined,
    uploadDate: "2026-01-15",
  };
}

export type SitemapEntry = {
  path: string;
  priority: string;
  changefreq: "weekly" | "monthly";
};

export function sitemapEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = [
    { path: PATHS.home, priority: "1.0", changefreq: "weekly" },
    { path: PATHS.packages, priority: "0.9", changefreq: "weekly" },
    { path: PATHS.compare, priority: "0.8", changefreq: "weekly" },
    { path: PATHS.guides, priority: "0.7", changefreq: "monthly" },
    { path: PATHS.paddockClub, priority: "0.8", changefreq: "monthly" },
    { path: PATHS.seats, priority: "0.8", changefreq: "monthly" },
    { path: PATHS.howToBuy, priority: "0.8", changefreq: "monthly" },
    { path: PATHS.corporate, priority: "0.7", changefreq: "monthly" },
    { path: PATHS.officialAccess, priority: "0.7", changefreq: "monthly" },
    { path: PATHS.faq, priority: "0.6", changefreq: "monthly" },
    { path: PATHS.privacy, priority: "0.3", changefreq: "monthly" },
  ];
  const products = PACKAGES.map((pkg) => ({
    path: packagePath(pkg.slug),
    priority: "0.8" as const,
    changefreq: "weekly" as const,
  }));
  return [...staticPages, ...products];
}

export function buildSitemapXml(lastmod = new Date().toISOString().slice(0, 10)): string {
  const urls = sitemapEntries()
    .map(
      (entry) => `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
