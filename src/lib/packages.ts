/** Public-folder path, with spaces and punctuation encoded for use in src. */
const media = (path: string) => encodeURI(path);

export type Tier = "signature" | "official" | "grandstand";

export const TIERS: Record<Tier, { label: string; short: string }> = {
  signature: { label: "ZK Signature Lounges", short: "Signature" },
  official: { label: "Official Hospitality", short: "Official" },
  grandstand: { label: "Grandstands", short: "Grandstand" },
};

export type FaqItem = {
  q: string;
  a: string;
};

export type Pkg = {
  id: string;
  slug: string;
  name: string;
  tier: Tier;
  where: string;
  headline: string;
  sub: string;
  /** Self-contained answer for the first screen and AI citations. */
  lead: string;
  description: string;
  bestFor: string;
  daysLabel: string;
  metaDescription: string;
  stats: { k: string; v: string }[];
  included: string[];
  faqs: FaqItem[];
  image: string;
  gallery: string[];
  /** Full-bleed film at the top of the package page. */
  video?: string;
  /** Feature film in the large gallery slot. */
  reel?: string;
  /** Still from the feature film — not a gallery photo. */
  reelPoster?: string;
  filmCaption?: string;
  hosted?: boolean;
  /** marker position on the circuit map viewBox */
  pin: { x: number; y: number };
};

export const EVENT = {
  name: "Abu Dhabi Grand Prix 2026",
  officialName: "Formula 1® Etihad Airways Abu Dhabi Grand Prix 2026",
  circuit: "Yas Marina Circuit",
  /** Race days — practice, qualifying and the Grand Prix. */
  dates: "04 – 06 Dec 2026",
  raceWeekend: "4–6 December 2026",
  fanWeekend: "Thursday 3 – Sunday 6 December 2026",
  fanOpens: "Thursday 3 December 2026",
  lightsOutUtc: "2026-12-06T13:00:00Z",
  lightsOutLabel: "Sunday 6 December 2026, 17:00 GST",
  startDate: "2026-12-04",
  endDate: "2026-12-06",
  fanStartDate: "2026-12-03",
  weekend: [
    ["Thu 03", "Fanzone opens", "After-race concert"],
    ["Fri 04", "Free practice", "After-race concert"],
    ["Sat 05", "Qualifying", "After-race concert"],
    ["Sun 06", "Grand Prix · 17:00", "Season finale"],
  ] as const,
};

const GRANDSTAND_INCLUDED = [
  "Your choice of seat in the grandstand",
  "After-Race Concerts, Thursday to Sunday (general admission)",
  "F1® Fanzone & Oasis — driver stage appearances",
  "1-day access to one of Abu Dhabi's themed attractions",
];

export const PACKAGES: Pkg[] = [
  {
    id: "01",
    slug: "skybridge-terrace",
    name: "Skybridge Terrace",
    tier: "signature",
    where: "W Abu Dhabi · T11–14",
    headline: "Watch the race from above it",
    sub: "The only hospitality venue built over the track. The cars pass directly beneath you.",
    lead: "Skybridge Terrace is ZK Sports & Entertainment’s over-track hospitality venue at the 2026 Abu Dhabi Grand Prix — the only lounge built above Yas Marina Circuit, spanning Turns 11–14 at W Abu Dhabi. Book Friday, Saturday, Sunday or the full 4–6 December weekend with live prices on this page.",
    description:
      "Skybridge Terrace spans Yas Marina Circuit at W Abu Dhabi – Yas Island. The cars pass directly beneath you through Turns 11 to 14, with the superyachts of Yas Marina on the other side. ZK hosts this room: glass lounge, open-air terrace, chef stations and an open bar, with F1 legends and expert hosts on the floor. It is built for guests who want a venue no other seller can copy — couples, private groups and companies who want the picture of the season finale taken from above the cars.",
    bestFor: "Guests who want the only view from over the track",
    daysLabel: "Friday, Saturday, Sunday or 3-day weekend",
    metaDescription:
      "Skybridge Terrace hospitality at Yas Marina Circuit — the only Abu Dhabi GP 2026 venue built over the track at Turns 11–14, hosted by ZK Sports. Live prices on the package page.",
    stats: [
      { k: "3 Days", v: "Practice, qualifying & race" },
      { k: "T11–T14", v: "Four corners in view" },
      { k: "Lounge+", v: "Glass lounge & open-air terrace" },
      { k: "Open bar", v: "Cocktails, champagne, wine & beer" },
    ],
    included: [
      "VIP lounge with floor-to-ceiling glass over the track",
      "Open-air terrace overlooking Turns 11–14",
      "Premium culinary experience all day, every day",
      "Live chef and carving stations",
      "Signature & classic cocktails, champagne, curated wine and beer",
      "Meet-and-greet with F1 legends and expert hosts",
      "DJs, hosts and live race-day commentary",
    ],
    faqs: [
      {
        q: "What do you see from Skybridge Terrace?",
        a: "The cars run directly beneath the glass lounge and terrace through Turns 11, 12, 13 and 14. Yas Marina and the W Abu Dhabi sit on the other side of the span.",
      },
      {
        q: "Can I book Skybridge for a single day?",
        a: "Yes. Skybridge Terrace is sold as Friday, Saturday, Sunday or the full 3-day weekend of 4–6 December 2026.",
      },
      {
        q: "Is Skybridge an official F1 venue or a ZK lounge?",
        a: "It is a ZK-hosted signature lounge at W Abu Dhabi, sold by ZK Sports as an official Yas Marina onseller. It is not the F1® Paddock Club™.",
      },
      {
        q: "Who is Skybridge Terrace for?",
        a: "Private groups, couples and companies who want a distinctive hosted room rather than a grandstand seat. Typical bookings are tables through to a full takeover.",
      },
      {
        q: "How do I book Skybridge?",
        a: "Choose Friday, Saturday, Sunday or the 3-day weekend, enter the guest count and pay securely on this page. If you have a question first, email contact@zk-sports.com or WhatsApp us.",
      },
    ],
    image: media("/gallery/skybridge-181.jpg"),
    gallery: [
      media("/gallery/skybridge-181.jpg"),
      media("/gallery/skybridge-180.jpg"),
      media("/gallery/skybridge-177.jpg"),
      media("/gallery/skybridge-182.jpg"),
      media("/gallery/skybridge-191.jpg"),
      media("/gallery/skybridge-175.jpg"),
      media("/gallery/skybridge-1455.jpg"),
      media("/gallery/skybridge-1463.jpg"),
      media("/gallery/skybridge-adf1-06.jpg"),
      media("/gallery/skybridge-adf1-24.jpg"),
    ],
    video: media("/films/skybridge-hero.mp4"),
    reel: media("/films/skybridge-reel.mp4"),
    reelPoster: media("/films/skybridge-reel.jpg"),
    filmCaption:
      "The Skybridge film shows the glass lounge spanning the circuit, cars passing under the terrace at Turns 11–14, and the marina and W Hotel after dusk.",
    hosted: true,
    pin: { x: 472, y: 581 },
  },
  {
    id: "02",
    slug: "marsa-box",
    name: "Marsa Box",
    tier: "signature",
    where: "Marina Grandstand · T8–11",
    headline: "Returning after a sold-out year",
    sub: "A covered lounge above the F2 garages — the track, the superyachts and the iconic W Hotel.",
    lead: "Marsa Box is ZK Sports & Entertainment’s covered lounge above the F2 garages at the Marina Grandstand, looking over Turns 8–11, Yas Marina and the W Hotel. It returns for the 2026 Abu Dhabi Grand Prix after a sold-out year and can be booked by day or as a 4–6 December weekend.",
    description:
      "Marsa Box sits inside the Marina Grandstand above the F2 garages — a wide-angle view of Turns 8–11 with the superyachts and the W Hotel in the same frame. ZK hosts the room: live cooking, champagne, racing simulators, DJs and Yasalam concert access. It is built for individuals and companies who want a lively hosted lounge rather than a reserved grandstand seat, and for groups who missed it when 2025 sold through.",
    bestFor: "Corporate groups who want a lively marina lounge",
    daysLabel: "Friday, Saturday, Sunday or 3-day weekend",
    metaDescription:
      "Marsa Box hospitality at Yas Marina Circuit — a ZK-hosted lounge above the F2 garages for the 2026 Abu Dhabi Grand Prix, returning after a sold-out year. Live prices on the package page.",
    stats: [
      { k: "T8–T11", v: "Wide-angle views" },
      { k: "3 Days", v: "Friday to Sunday" },
      { k: "Open bar", v: "Champagne & beverages" },
      { k: "Yasalam", v: "After-race concerts" },
    ],
    included: [
      "Live DJs, dancers, saxophonists and magicians",
      "State-of-the-art racing simulators",
      "All Yasalam after-race concerts, Friday to Sunday",
      "Gourmet dining with live cooking stations",
      "Premium open bar with free-flowing champagne and beverages",
      "Sunset views from the lounge and its luxury balcony",
    ],
    faqs: [
      {
        q: "Where is Marsa Box at Yas Marina Circuit?",
        a: "Inside the Marina Grandstand, above the F2 garages, with views of Turns 8–11, the marina and the W Abu Dhabi.",
      },
      {
        q: "Was Marsa Box sold out last year?",
        a: "Yes. The 2025 allocation sold through. 2026 inventory is limited again — request availability rather than assuming walk-up space.",
      },
      {
        q: "Can I book Marsa Box by the day?",
        a: "Yes. Friday, Saturday, Sunday or the full 3-day weekend. Official hospitality next door is typically weekend-only.",
      },
      {
        q: "How is Marsa Box different from Marina Views Brunch?",
        a: "Marsa Box is a ZK-hosted lounge with entertainment, simulators and day-by-day booking. Marina Views Brunch is official circuit hospitality with unreserved table seating and a quieter brunch format, sold as a 3-day weekend only.",
      },
      {
        q: "Is Marsa Box suitable for a company booking?",
        a: "Yes. It is one of the rooms we use most for client entertainment and staff rewards. Tell us your numbers and we will hold a table or look at a private area.",
      },
    ],
    image: media("/gallery/marsa-049.jpg"),
    gallery: [
      media("/gallery/marsa-105.jpg"),
      media("/gallery/marsa-283.jpg"),
      media("/gallery/marsa-259.jpg"),
      media("/gallery/marsa-049.jpg"),
      media("/gallery/marsa-016.jpg"),
      media("/gallery/marsa-063.jpg"),
      media("/gallery/marsa-070.jpg"),
      media("/gallery/marsa-038.jpg"),
      media("/gallery/marsa-254.jpg"),
      media("/gallery/marsa-029.jpg"),
    ],
    video: media("/films/marsa-hero.mp4"),
    reel: media("/films/marsa-reel.mp4"),
    reelPoster: media("/films/marsa-reel.jpg"),
    filmCaption:
      "The Marsa Box film shows the covered lounge above the F2 garages, the balcony over the marina, live entertainment and the W Hotel after sunset.",
    hosted: true,
    pin: { x: 150, y: 431 },
  },
  {
    id: "03",
    slug: "velocity-terrace",
    name: "Velocity Terrace",
    tier: "signature",
    where: "Yas Marina · T8–11",
    headline: "Sundowners at the sharp end",
    sub: "Sweeping views of Turns 8–11, free-flowing champagne and Yasalam concert access.",
    lead: "Velocity Terrace is ZK Sports & Entertainment’s open terrace at Yas Marina for the 2026 Abu Dhabi Grand Prix, looking across Turns 8–11 with champagne, dining and Yasalam concert access. Guests are 16 and over. Book a single day or the 4–6 December weekend with live prices on this page.",
    description:
      "Velocity Terrace hospitality at Yas Marina with sweeping views of Turns 8–11, gourmet dining, premium open bar, live entertainment, racing simulators and Yasalam concert access. Guests aged 16 and over. ZK hosts the terrace — it is the more open-air sibling of Marsa Box, aimed at groups who want sundowners and a wide view of the marina corners rather than a fully enclosed lounge.",
    bestFor: "Groups who want an open terrace and champagne",
    daysLabel: "Friday, Saturday, Sunday or 3-day weekend",
    metaDescription:
      "Velocity Terrace hospitality at Yas Marina Circuit — Turns 8–11, champagne and Yasalam access for the 2026 Abu Dhabi Grand Prix. Hosted by ZK Sports. Ages 16+. Live prices on the package page.",
    stats: [
      { k: "8–11", v: "Turns in view" },
      { k: "3 Days", v: "04 – 06 Dec" },
      { k: "Champagne", v: "Free-flowing" },
      { k: "Yasalam", v: "After-race concerts" },
    ],
    included: [
      "Sweeping views of Turns 8, 9, 10 and 11",
      "Curated menus prepared by highly trained chefs",
      "Premium open bar with free-flowing champagne",
      "International mixologists",
      "Live DJs, dancers, saxophonists and magicians",
      "State-of-the-art racing simulators",
      "Exclusive VIP terrace access",
      "Yasalam after-race concerts on your booked days",
    ],
    faqs: [
      {
        q: "What do you see from Velocity Terrace?",
        a: "A wide view of Turns 8, 9, 10 and 11 at Yas Marina — the same marina sector as Marsa Box, from an open terrace rather than a covered box.",
      },
      {
        q: "Is there an age limit at Velocity Terrace?",
        a: "Yes. Guests are 16 and over.",
      },
      {
        q: "Can I book Velocity for Friday only?",
        a: "Yes. Friday, Saturday, Sunday or the full 3-day weekend. Concert access is included on the days you book.",
      },
      {
        q: "How is Velocity Terrace different from Marsa Box?",
        a: "Both look at Turns 8–11 and both are hosted by ZK. Marsa Box is a covered lounge above the F2 garages. Velocity is an open terrace with a stronger sundowner feel. We will recommend one once we know your group size and date.",
      },
      {
        q: "Does the ticket include Yasalam concerts?",
        a: "Yes — after-race concerts on the days you book, subject to the official 2026 programme.",
      },
    ],
    image: media("/gallery/velocity-161.jpg"),
    gallery: [
      media("/gallery/velocity-161.jpg"),
      media("/gallery/velocity-137.jpg"),
      media("/gallery/velocity-130.jpg"),
      media("/gallery/velocity-131.jpg"),
      media("/gallery/velocity-1507.jpg"),
      media("/gallery/velocity-1525.jpg"),
      media("/gallery/velocity-007.jpg"),
      media("/gallery/velocity-052.jpg"),
    ],
    video: media("/films/velocity-hero.mp4"),
    reel: media("/films/velocity-reel.mp4"),
    reelPoster: media("/films/velocity-reel.jpg"),
    filmCaption:
      "The Velocity Terrace film shows the open terrace over Turns 8–11, the champagne service, and the marina lights as qualifying and race day run into night.",
    hosted: true,
    pin: { x: 294, y: 850 },
  },
  {
    id: "04",
    slug: "paddock-club",
    name: "F1® Paddock Club™",
    tier: "official",
    where: "The Paddock · Pit lane",
    headline: "Three days in the paddock",
    sub: "Step behind the scenes of every battle, every pit stop, every decision that defines a season.",
    lead: "F1® Paddock Club™ at the 2026 Abu Dhabi Grand Prix is official Formula 1 hospitality above the pit lane at Yas Marina Circuit, sold by ZK Sports & Entertainment as an authorised Paddock Club distributor. The standard package is the 4–6 December weekend; we can also request Team, Legend and House 44 suites. Contact us for availability.",
    description:
      "Immerse yourself in the world of Formula 1®. Unique insights from true legends of the sport, and a front-row seat to what makes an F1® team tick. The Club sits over the pit lane and the start-finish straight — pit stops, the race start and the podium. ZK Sports is an F1® Paddock Club™ Authorised Distributor. We can also access Paddock Club™ options such as Teams, House 44, Legend and more when allocation exists. This is the official inner-circle product, not a ZK-hosted lounge.",
    bestFor: "Guests who want official pit-lane access",
    daysLabel: "3-day weekend only",
    metaDescription:
      "Official F1® Paddock Club™ for the 2026 Abu Dhabi Grand Prix at Yas Marina Circuit, sold by ZK Sports as an authorised distributor. Team, Legend and House 44 options on request.",
    stats: [
      { k: "Pit lane", v: "Aramco F1® Pit Lane Walk" },
      { k: "Live Q&A", v: "Drivers & ambassadors" },
      { k: "Track tour", v: "Guided" },
      { k: "3 Days", v: "Paddock Club™ access" },
    ],
    included: [
      "3-day F1® Paddock Club™ access",
      "Aramco F1® Pit Lane Walk",
      "Live Q&As with F1® drivers and ambassadors",
      "Access to the Club Lounge",
      "Spectacular views over the pit straight",
      "Guided track tour",
      "A fusion of global and local cuisine",
      "Live music, DJ sets, racing sims",
    ],
    faqs: [
      {
        q: "What is included in Paddock Club at Abu Dhabi?",
        a: "3-day Club access, the Aramco F1® Pit Lane Walk, a guided track tour, driver and ambassador Q&As, the Club Lounge, pit-straight views, dining and entertainment. Your consultant confirms the exact 2026 inclusions in writing before you pay.",
      },
      {
        q: "Can ZK book Team, Legend or House 44 suites?",
        a: "Yes, when allocation is open. ZK is an authorised Paddock Club distributor and regularly places guests in Team suites, Legend and House 44. Tell us which experience you want and we will confirm what is left.",
      },
      {
        q: "Is Paddock Club sold as a single day?",
        a: "The package on this page is the 3-day weekend of 4–6 December 2026. If a single-day Club option is released, your consultant will offer it.",
      },
      {
        q: "How do I know ZK is an authorised seller?",
        a: "ZK Sports & Entertainment is listed as an official Yas Marina Circuit onseller and is an F1® Paddock Club™ Authorised Distributor. The circuit publishes the onseller list at yasmarinacircuit.com/en/onsellers.",
      },
      {
        q: "Is Paddock Club worth it versus a ZK signature lounge?",
        a: "Choose Paddock Club for pit-lane access, the walk and the official inner circle. Choose Skybridge, Marsa Box or Velocity if you want a ZK-hosted room, a different view, or day-by-day flexibility. We compare both on the compare page.",
      },
    ],
    image: media("/gallery/paddock-race.jpg"),
    gallery: [
      media("/gallery/paddock-race.jpg"),
      media("/gallery/paddock-garage.jpg"),
      media("/gallery/paddock-terrace.jpg"),
    ],
    pin: { x: 640, y: 436 },
  },
  {
    id: "05",
    slug: "club-58",
    name: "Club 58",
    tier: "official",
    where: "Longest straight",
    headline: "Roka, on the longest straight",
    sub: "Contemporary Japanese hospitality overlooking the circuit's fastest moments.",
    lead: "Club 58 is official Abu Dhabi Grand Prix 2026 hospitality on Yas Marina’s longest straight: Roka Japanese dining, an indoor suite with table seating, and a balcony over cars at full speed. Sold as a 4–6 December weekend by ZK Sports, a Yas Marina official onseller. Live prices on the package page.",
    description:
      "Roka's acclaimed cuisine, an elegant indoor suite with table seating and signature cocktails, and a balcony over high-speed racing. Club 58 is official circuit hospitality, not a ZK-hosted lounge — we sell it as an authorised onseller. After-race concerts at Etihad Park, Fanzone access and a themed attraction day are part of the official ticket. It suits guests who want a quieter table, Japanese food, and the longest straight rather than the pit lane or the marina corners.",
    bestFor: "Guests who want Roka dining over the longest straight",
    daysLabel: "3-day weekend only",
    metaDescription:
      "Club 58 hospitality at the 2026 Abu Dhabi Grand Prix — Roka Japanese dining and balcony views over Yas Marina’s longest straight. Official tickets via ZK Sports. Live prices on the package page.",
    stats: [
      { k: "Roka", v: "Japanese dining" },
      { k: "Suite", v: "Indoor, table seating" },
      { k: "Balcony", v: "Over the straight" },
      { k: "Concerts", v: "Etihad Park" },
    ],
    included: [
      "Japanese dining by Roka with signature cocktails",
      "Indoor suite with table seating and balcony views",
      "DJ-led music throughout",
      "After-Race Concerts at Etihad Park (general admission)",
      "1-day access to one of Abu Dhabi's top themed attractions",
      "Complimentary entry to selected museums",
      "F1® Fanzone and Oasis areas",
    ],
    faqs: [
      {
        q: "What is Club 58 at the Abu Dhabi Grand Prix?",
        a: "Official hospitality on the longest straight: an indoor suite with table seating, a balcony over high-speed cars, and Japanese dining by Roka.",
      },
      {
        q: "What food is served at Club 58?",
        a: "Roka’s contemporary Japanese menu with signature cocktails. Exact 2026 menus are confirmed closer to the weekend.",
      },
      {
        q: "Is Club 58 a grandstand seat or a suite?",
        a: "A hospitality suite with table seating and a balcony — not an open grandstand seat.",
      },
      {
        q: "Does Club 58 include concerts and attractions?",
        a: "Yes. After-race concerts at Etihad Park (general admission), Fanzone and Oasis access, a themed-attraction day, and selected museum entry are part of the official ticket.",
      },
      {
        q: "Can I book Club 58 for one day?",
        a: "No. This package is the 3-day weekend of 4–6 December 2026.",
      },
    ],
    image: media("/gallery/club58-suite.jpg"),
    gallery: [
      media("/gallery/club58-suite.jpg"),
      media("/gallery/club58-restaurant.jpg"),
      media("/gallery/club58-bar.jpg"),
      media("/gallery/club58-straight.jpg"),
    ],
    pin: { x: 377, y: 83 },
  },
  {
    id: "06",
    slug: "marina-views-brunch",
    name: "Marina Views Brunch",
    tier: "official",
    where: "Marina Grandstand",
    headline: "Brunch with the superyachts",
    sub: "Gourmet dining with Yas Marina and the illuminated W Abu Dhabi as your backdrop.",
    lead: "Marina Views Brunch is official 2026 Abu Dhabi Grand Prix hospitality in the Marina Grandstand: unreserved table seating, gourmet dining, and views of Yas Marina and the W Hotel. ZK Sports sells the 4–6 December weekend as a Yas Marina official onseller. Live prices on the package page.",
    description:
      "Premium hospitality, gourmet dining and views of Yas Marina and its challenging corners, with after-race concerts and official weekend benefits. The venue is air-conditioned with unreserved table seating — a calmer official product than ZK’s hosted Marsa Box in the same grandstand. Opening Thursday access to the Fanzone and West Oasis is included with the official ticket, alongside a themed-attraction day.",
    bestFor: "Guests who want a marina brunch without a takeover",
    daysLabel: "3-day weekend only",
    metaDescription:
      "Marina Views Brunch at the 2026 Abu Dhabi Grand Prix — official hospitality in the Marina Grandstand with Yas Marina and W Hotel views. Sold by ZK Sports. Live prices on the package page.",
    stats: [
      { k: "Marina", v: "Superyacht views" },
      { k: "A/C", v: "Luxury venue" },
      { k: "Thu–Sun", v: "After-race concerts" },
      { k: "3 Days", v: "Weekend pass" },
    ],
    included: [
      "Views of Yas Marina and the illuminated W Abu Dhabi",
      "Luxury air-conditioned venue, unreserved table seating",
      "Dedicated, high-quality live entertainment",
      "F1® drivers up close during stage appearances",
      "After-Race Concerts, Thursday to Sunday",
      "Opening Thursday at the F1® Fanzone and West Oasis",
      "1-day access to one of Abu Dhabi's themed attractions",
    ],
    faqs: [
      {
        q: "Where is Marina Views Brunch?",
        a: "In the Marina Grandstand at Yas Marina Circuit, looking over the marina, the corners above the F2 pits, and the illuminated W Abu Dhabi.",
      },
      {
        q: "Is seating reserved?",
        a: "Table seating is unreserved inside the air-conditioned venue. Arrive as a group if you want to sit together.",
      },
      {
        q: "What days does the package cover?",
        a: "The 3-day race weekend of 4–6 December 2026, plus Thursday Fanzone and West Oasis access and after-race concerts Thursday to Sunday.",
      },
      {
        q: "How does it compare to Marsa Box?",
        a: "Both sit in the marina sector. Marina Views is official brunch hospitality with unreserved tables. Marsa Box is a ZK-hosted lounge with entertainment, simulators and day-by-day booking.",
      },
      {
        q: "Can I add hotels or transfers?",
        a: "Yes. We add Yas Island hotels and airport transfers to any official package. Mention it when you contact us.",
      },
    ],
    image: media("/gallery/marsa-049.jpg"),
    gallery: [
      media("/gallery/marsa-049.jpg"),
      media("/marina views/slider_images-1.jpg"),
      media("/marina views/tab_1_image.jpg"),
    ],
    pin: { x: 210, y: 431 },
  },
  {
    id: "07",
    slug: "south-club",
    name: "South Club",
    tier: "official",
    where: "Turn 9 · Marsa Corner",
    headline: "Celebration, meet comfort",
    sub: "Side-by-side battles at Marsa Corner, then retreat to the air-conditioned lounge.",
    lead: "South Club is official 2026 Abu Dhabi Grand Prix hospitality at Turn 9 (Marsa Corner): a grandstand seat plus an air-conditioned lounge with à la carte dining and a cash bar. ZK Sports sells the 4–6 December weekend as a Yas Marina official onseller. Live prices on the package page.",
    description:
      "The blend of a race seat and a lounge. You watch side-by-side battles at the Turn 9 hairpin, then step into the air-conditioned South Club for à la carte dining and a cash bar — food and drink are not an open bar. It is the step up from a South Grandstand ticket when you want shade, a table and a reserved seat in the same sector.",
    bestFor: "Fans who want a Turn 9 seat plus a lounge",
    daysLabel: "3-day weekend only",
    metaDescription:
      "South Club hospitality at the 2026 Abu Dhabi Grand Prix — Turn 9 Marsa Corner views, a grandstand seat and an air-conditioned lounge. Official tickets via ZK Sports. Live prices on the package page.",
    stats: [
      { k: "T9", v: "Marsa Corner" },
      { k: "Lounge", v: "Air-conditioned" },
      { k: "À la carte", v: "Dining & cash bar" },
      { k: "Seat", v: "Your choice" },
    ],
    included: [
      "Prime views of Marsa Corner (Turn 9)",
      "Air-conditioned South Club lounge with live race coverage",
      "À la carte dining and cash bar",
      "Your choice of seat in the grandstand",
      "F1® drivers up close during stage appearances",
      "After-Race Concerts (general admission)",
      "F1® Fanzone, Oasis and 1-day themed attraction access",
    ],
    faqs: [
      {
        q: "What is South Club?",
        a: "Official hospitality at Turn 9: your choice of grandstand seat plus access to the air-conditioned South Club lounge.",
      },
      {
        q: "Is food included?",
        a: "Dining is à la carte and the bar is a cash bar. That is the main difference from all-inclusive lounges such as Skybridge or Paddock Club.",
      },
      {
        q: "Do I get a reserved grandstand seat?",
        a: "Yes. You choose your seat in the South Grandstand as part of the package.",
      },
      {
        q: "How is South Club different from South Grandstand?",
        a: "South Grandstand is the seat, concerts, Fanzone and attraction day. South Club adds the lounge, à la carte dining and a cash bar.",
      },
      {
        q: "Is it sold by the day?",
        a: "No. South Club is the 3-day weekend of 4–6 December 2026.",
      },
    ],
    image: media("/south grandstand/ADGP_Web_South_1920x694px_V2.jpg"),
    gallery: [
      media("/south grandstand/ADGP_Web_South_1920x694px_V2.jpg"),
      media("/gallery/marsa-049.jpg"),
    ],
    pin: { x: 118, y: 850 },
  },
  {
    id: "08",
    slug: "south-grandstand",
    name: "South Grandstand",
    tier: "grandstand",
    where: "Turn 9 · Marsa Corner",
    headline: "The final-sector fight",
    sub: "High-speed, side-by-side battles with the yachts and W Abu Dhabi as backdrop.",
    lead: "South Grandstand is an official 2026 Abu Dhabi Grand Prix seat at Turn 9, Marsa Corner — the final-sector hairpin with the marina and W Hotel behind the cars. ZK Sports sells the 4–6 December weekend as a Yas Marina official onseller. Live prices on the package page.",
    description:
      "High-speed, side-by-side battles in the final sector, with the yachts and W Abu Dhabi as backdrop. This is a grandstand ticket, not a hospitality lounge: you get a seat of your choice, after-race concerts Thursday to Sunday, Fanzone and Oasis access, and a themed-attraction day. Step up to South Club if you want the same view plus an air-conditioned lounge.",
    bestFor: "Fans who want Turn 9 battles without hospitality pricing",
    daysLabel: "3-day weekend only",
    metaDescription:
      "South Grandstand tickets for the 2026 Abu Dhabi Grand Prix at Turn 9, Marsa Corner — official Yas Marina seats via ZK Sports, with concerts and Fanzone. Live prices on the package page.",
    stats: [
      { k: "T9", v: "Marsa Corner" },
      { k: "3 Days", v: "Grandstand ticket" },
      { k: "Concerts", v: "Thu–Sun" },
      { k: "Fanzone", v: "Included" },
    ],
    included: GRANDSTAND_INCLUDED,
    faqs: [
      {
        q: "What do you see from South Grandstand?",
        a: "Turn 9, Marsa Corner — cars braking from the second straight into the hairpin, with the marina and W Hotel in the background.",
      },
      {
        q: "Is this hospitality or a seat?",
        a: "A grandstand seat. Food and drink are not included. Concerts, Fanzone, Oasis and one themed-attraction day are.",
      },
      {
        q: "Who should sit in the South Grandstand?",
        a: "Fans who want on-track overtaking in the final sector and a lower ticket than Club or lounge hospitality.",
      },
      {
        q: "Can I upgrade to South Club?",
        a: "Yes, when allocation remains. South Club keeps the Turn 9 view and adds the lounge, à la carte dining and a cash bar.",
      },
      {
        q: "Is it a single-day ticket?",
        a: "No. South Grandstand on this site is the 3-day weekend of 4–6 December 2026.",
      },
    ],
    image: media("/south grandstand/ADGP_Web_South_1920x694px_V2.jpg"),
    gallery: [
      media("/south grandstand/ADGP_Web_South_1920x694px_V2.jpg"),
      media("/gallery/marsa-049.jpg"),
    ],
    pin: { x: 58, y: 850 },
  },
  {
    id: "09",
    slug: "north-grandstand",
    name: "North Grandstand",
    tier: "grandstand",
    where: "Turn 5 · Hairpin",
    headline: "Brake. Battle. Blast.",
    sub: "Heavy braking and wheel-to-wheel racing before the longest straight.",
    lead: "North Grandstand is an official 2026 Abu Dhabi Grand Prix seat at Turn 5, the hairpin before Yas Marina’s longest straight, next to the Etihad Park concerts. ZK Sports sells the 4–6 December weekend as a Yas Marina official onseller. Live prices on the package page.",
    description:
      "Heavy braking and wheel-to-wheel battles before the cars blast onto the longest straight. Easy access to the concerts at Etihad Park. This is a grandstand ticket with after-race concerts, Fanzone and a themed-attraction day — not a lounge. Choose it if the hairpin and a short walk to the stage matter more than marina or pit-lane views.",
    bestFor: "Fans who want the Turn 5 hairpin next to the concerts",
    daysLabel: "3-day weekend only",
    metaDescription:
      "North Grandstand tickets for the 2026 Abu Dhabi Grand Prix at Turn 5 — official Yas Marina seats beside Etihad Park, sold by ZK Sports. Live prices on the package page.",
    stats: [
      { k: "T5", v: "Hairpin" },
      { k: "3 Days", v: "Grandstand ticket" },
      { k: "Etihad Park", v: "Next to concerts" },
      { k: "Fanzone", v: "Included" },
    ],
    included: GRANDSTAND_INCLUDED,
    faqs: [
      {
        q: "What do you see from North Grandstand?",
        a: "Turn 5, the hairpin: heavy braking, wheel-to-wheel fights, then the cars accelerate onto the longest straight.",
      },
      {
        q: "Is North Grandstand close to the concerts?",
        a: "Yes. Etihad Park sits next to this grandstand — the shortest walk of the three stands we sell.",
      },
      {
        q: "What's included besides the seat?",
        a: "After-race concerts Thursday to Sunday (general admission), F1® Fanzone and Oasis, and one themed-attraction day.",
      },
      {
        q: "Is this a hospitality lounge?",
        a: "No. It is a grandstand ticket. If you want dining included, look at Club 58, South Club or a ZK signature lounge.",
      },
      {
        q: "Can I buy Friday only?",
        a: "Not on this page. North Grandstand is the 3-day weekend of 4–6 December 2026.",
      },
    ],
    image: media("/north grandstand/ADGP_Web_North_1920x694px_V2.jpg"),
    gallery: [
      media("/north grandstand/ADGP_Web_North_1920x694px_V2.jpg"),
    ],
    pin: { x: 1533, y: 113 },
  },
  {
    id: "10",
    slug: "west-grandstand",
    name: "West Grandstand",
    tier: "grandstand",
    where: "Longest straight · T6–7",
    headline: "300 km/h, then the lunge",
    sub: "Cars at full speed, then high-stakes overtaking into Turns 6 and 7.",
    lead: "West Grandstand is an official 2026 Abu Dhabi Grand Prix seat on Yas Marina’s longest straight, looking at Turns 6 and 7 — one of the circuit’s main overtaking zones. ZK Sports sells the 4–6 December weekend as a Yas Marina official onseller. Live prices on the package page.",
    description:
      "Cars at 300+ km/h on the longest straight, then high-stakes overtaking into Turns 6 and 7. West is the stand most first-time visitors ask about when they want racing rather than the start-finish ceremony. It is a seat, not a lounge: concerts, Fanzone and a themed-attraction day are included. Club 58 sits over the same straight if you want Roka and a suite instead.",
    bestFor: "Fans who want 300 km/h and the Turn 6–7 overtaking zone",
    daysLabel: "3-day weekend only",
    metaDescription:
      "West Grandstand tickets for the 2026 Abu Dhabi Grand Prix — official Yas Marina seats on the longest straight at Turns 6–7, sold by ZK Sports. Live prices on the package page.",
    stats: [
      { k: "300+", v: "km/h" },
      { k: "T6–T7", v: "Overtaking zone" },
      { k: "3 Days", v: "Grandstand ticket" },
      { k: "Fanzone", v: "Included" },
    ],
    included: GRANDSTAND_INCLUDED,
    faqs: [
      {
        q: "Why is West Grandstand one of the most asked-for seats?",
        a: "It faces the longest straight and the braking zone into Turns 6 and 7 — the place most people mean when they say they want to see an overtake.",
      },
      {
        q: "What speed do the cars reach here?",
        a: "Over 300 km/h on the straight before they brake for the chicane.",
      },
      {
        q: "Is West Grandstand hospitality?",
        a: "No. It is a grandstand ticket with concerts, Fanzone and a themed-attraction day. Club 58 is the hospitality suite on the same straight.",
      },
      {
        q: "Who is it for?",
        a: "Fans who care more about on-track speed and passing than the grid, podium or marina yachts.",
      },
      {
        q: "Is it sold as a single day?",
        a: "No. West Grandstand on this site is the 3-day weekend of 4–6 December 2026.",
      },
    ],
    image: media("/west grandstand/ADGP_Web_West_Grandstand_1920x694px_V2.jpg"),
    gallery: [
      media("/west grandstand/ADGP_Web_West_Grandstand_1920x694px_V2.jpg"),
      media("/gallery/club58-straight.jpg"),
    ],
    pin: { x: 510, y: 57 },
  },
];

export const getPackage = (slug: string) => PACKAGES.find((p) => p.slug === slug);

const FLEXIBLE_DAY_SLUGS = new Set(["skybridge-terrace", "marsa-box", "velocity-terrace"]);

/** Skybridge, Marsa Box and Velocity Terrace can be booked by day. Every other package is the full weekend only. */
export function dayOptionsFor(slug: string) {
  return FLEXIBLE_DAY_SLUGS.has(slug) ? ["3-day weekend", "Friday", "Saturday", "Sunday"] : ["3-day weekend"];
}

export function relatedGuideFor(pkg: Pkg): { path: "/guides/paddock-club" | "/guides/yas-marina-seats" | "/compare"; label: string } {
  if (pkg.slug === "paddock-club") return { path: "/guides/paddock-club", label: "Paddock Club guide" };
  if (pkg.tier === "grandstand" || pkg.slug === "south-club" || pkg.slug === "club-58" || pkg.slug === "marina-views-brunch") {
    return { path: "/guides/yas-marina-seats", label: "Yas Marina seating guide" };
  }
  return { path: "/compare", label: "Compare hospitality" };
}
