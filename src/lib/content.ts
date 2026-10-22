import { EVENT, type FaqItem } from "@/lib/packages";
import { BRAND, CONTACT_EMAIL, PATHS } from "@/lib/site";

export const SHARED_FAQS: FaqItem[] = [
  {
    q: "What's included in the price?",
    a: "Everything listed under “What's included” on the package page, for each day you book. Signature lounges, Club 58, Marina Views, South Club and grandstands show live prices and remaining seats. Paddock Club variants stay with a consultant.",
  },
  {
    q: "Are you an official seller?",
    a: `Yes. ${BRAND.legalName} is an F1® Paddock Club™ Authorised Distributor and a Yas Marina Circuit Official On-Seller. The circuit lists ZK Sports on the authorised onseller page.`,
  },
  {
    q: "Can I book for a group or a company?",
    a: `Yes. We regularly host corporate groups, from a single table to a private area. Buy a listed package online, or email ${CONTACT_EMAIL} for a private area or mixed inventory.`,
  },
  {
    q: "How do tickets arrive?",
    a: "Tickets are issued digitally by the promoter closer to race week. Your consultant sends access details and arrival guidance. Nothing is posted that you have to collect at the airport.",
  },
  {
    q: "Can you arrange hotels and transfers?",
    a: "Yes. We add Yas Island hotels, airport transfers and on-island transport to any package.",
  },
  {
    q: "Is there a dress code?",
    a: "Smart casual is the norm across hospitality. Comfortable shoes are recommended — circuits involve plenty of walking. Grandstand guests dress for sun and evening temperatures.",
  },
  {
    q: "When is the 2026 Abu Dhabi Grand Prix?",
    a: `The race weekend is ${EVENT.raceWeekend} at ${EVENT.circuit}. Lights out is ${EVENT.lightsOutLabel}. The Fanzone and after-race concerts run from ${EVENT.fanOpens} through Sunday.`,
  },
  {
    q: "Are the prices on this site live?",
    a: "Yes for the packages we sell online. The figure is the current CRM price and remaining allocation. Paddock Club team suites stay on request because the SKU changes.",
  },
  {
    q: "How fast do you reply?",
    a: `Online bookings confirm immediately. Email and WhatsApp questions get a reply within ${BRAND.responseTime}.`,
  },
  {
    q: "What's the difference between Thursday and the race weekend?",
    a: `Thursday ${EVENT.fanStartDate.slice(8)} December is Fanzone and concert day. Practice, qualifying and the Grand Prix run ${EVENT.raceWeekend}. Some official tickets include Thursday access; ZK signature lounges are sold against the race days you choose.`,
  },
];

export const FAQ_CLIPS = [
  {
    src: "/faq%201.mp4",
    title: "The experiences",
    caption:
      "A walk through the three ways to watch the 2026 Abu Dhabi Grand Prix with ZK: hosted signature lounges, official hospitality, and grandstand seats around Yas Marina Circuit.",
  },
  {
    src: "/faq%202.mp4",
    title: "Groups and tickets",
    caption:
      "How company bookings, private tables and group sizes work, and how digital tickets are issued by the promoter closer to race week.",
  },
  {
    src: "/faq%203.mp4",
    title: "Official access",
    caption:
      "Why ZK Sports & Entertainment can sell these tickets: F1® Paddock Club™ authorised distributor and Yas Marina Circuit official onseller.",
  },
] as const;

export type GuideSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type GuidePage = {
  path: typeof PATHS.paddockClub | typeof PATHS.seats | typeof PATHS.howToBuy;
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
  image: string;
  imageAlt: string;
  sections: GuideSection[];
};

export const GUIDES: GuidePage[] = [
  {
    path: PATHS.paddockClub,
    eyebrow: "Official Formula 1 hospitality",
    title: "Paddock Club at the Abu Dhabi Grand Prix 2026",
    lead: "F1® Paddock Club™ at the 2026 Abu Dhabi Grand Prix is official Formula 1 hospitality above the pit lane at Yas Marina Circuit. ZK Sports & Entertainment sells it as an authorised Paddock Club distributor, including Team, Legend and House 44 suites when allocation remains. The standard package is the 4–6 December weekend. Prices are on request.",
    description:
      "What F1® Paddock Club™ includes at Yas Marina Circuit in 2026, which suite types ZK can request, and when a ZK signature lounge is the better buy.",
    image: "/paddock/paddock-club-guide.jpg",
    imageAlt: "Guests at a team garage on the pit lane at Yas Marina Circuit",
    sections: [
      {
        heading: "What is Paddock Club at Yas Marina?",
        body: [
          "The Club sits over the team garages and the start-finish straight. You watch the grid form, the race start, the pit stops and the podium from the same building the teams use.",
          "It is Formula 1’s own hospitality product. ZK does not host this room — we sell official allocation as an authorised distributor. That is the difference between Paddock Club and Skybridge, Marsa Box or Velocity Terrace.",
        ],
      },
      {
        heading: "What is included in 2026?",
        body: [
          "The standard 3-day package we sell includes Club access from Friday to Sunday, the Aramco F1® Pit Lane Walk, a guided track tour, live Q&As, the Club Lounge, pit-straight views, dining and entertainment.",
          "Inclusions are confirmed in writing before you pay. The official 2026 programme can still shift.",
        ],
        bullets: [
          "3-day F1® Paddock Club™ access, 4–6 December 2026",
          "Aramco F1® Pit Lane Walk",
          "Guided track tour",
          "Driver and ambassador Q&As",
          "Club Lounge, dining and entertainment",
        ],
      },
      {
        heading: "Which Paddock Club options can ZK request?",
        body: [
          "Besides the shared Club, we place guests in Team suites, Legend and House 44 when those rooms still have inventory. House 44 is the Soho House collaboration with Sir Lewis Hamilton. Legend and Team suites sit closer to a specific garage and guest list.",
          "If you already know the suite, say so on the enquiry. If you do not, we will match the remaining rooms to your group size and budget.",
        ],
      },
      {
        heading: "Is Paddock Club worth it?",
        body: [
          "It is worth it if the pit lane, the walk and the official inner circle are the reason you are travelling. It is the wrong buy if you want cars passing under a glass floor, a marina terrace, or a Friday-only ticket — those are Skybridge, Marsa Box and Velocity.",
          "We do not publish a single Club price here because suite type and remaining allocation change the number. Ask and we will quote what is actually left.",
        ],
      },
    ],
  },
  {
    path: PATHS.seats,
    eyebrow: "Where to sit",
    title: "Best seats at Yas Marina Circuit for 2026",
    lead: "The best seat at the 2026 Abu Dhabi Grand Prix depends on what you want to watch. West Grandstand is the longest straight and Turns 6–7. North is the Turn 5 hairpin next to the concerts. South is Turn 9 and the marina. Skybridge is the only venue built over the track. ZK Sports sells official seats and hosted lounges as a Yas Marina onseller.",
    description:
      "A practical Yas Marina seating guide for 2026: West, North and South grandstands, marina hospitality, Paddock Club and Skybridge Terrace.",
    image: "/west grandstand/ADGP_Web_West_Grandstand_1920x694px_V2.jpg",
    imageAlt: "West Grandstand view of the longest straight at Yas Marina Circuit",
    sections: [
      {
        heading: "West Grandstand — speed and overtakes",
        body: [
          "Sit here for cars above 300 km/h and the lunge into Turns 6 and 7. It is the stand first-time visitors usually mean when they ask for “the overtaking seat”.",
          "It is a seat, not a lounge. Club 58 is the official suite on the same straight if you want Roka and a table.",
        ],
      },
      {
        heading: "North Grandstand — the hairpin by the concerts",
        body: [
          "Turn 5 is heavy braking before the longest straight. The practical bonus is the walk to Etihad Park — the shortest of the three stands we sell.",
        ],
      },
      {
        heading: "South Grandstand and South Club — Marsa Corner",
        body: [
          "Turn 9 is the final-sector hairpin with the yachts and the W Hotel in the background. South Grandstand is the seat. South Club adds an air-conditioned lounge with à la carte dining and a cash bar.",
        ],
      },
      {
        heading: "Marina sector — brunch, Marsa Box, Velocity",
        body: [
          "Turns 8–11 look over the marina. Marina Views Brunch is official table hospitality. Marsa Box is ZK’s covered lounge above the F2 garages. Velocity Terrace is ZK’s open terrace with champagne. All three see the same corners; the difference is how you spend the day.",
        ],
      },
      {
        heading: "Over the track — Skybridge Terrace",
        body: [
          "Skybridge is the only hospitality venue built above the circuit, spanning Turns 11–14 at W Abu Dhabi. Choose it when the picture you want is cars passing under your feet, not the pit lane or the longest straight.",
        ],
      },
      {
        heading: "Pit lane — Paddock Club",
        body: [
          "If the grid, pit stops and podium matter more than a corner battle, Paddock Club is the seat. It is official Formula 1 hospitality, sold by ZK as an authorised distributor.",
        ],
      },
    ],
  },
  {
    path: PATHS.howToBuy,
    eyebrow: "Official tickets",
    title: "How to buy official Abu Dhabi GP 2026 tickets",
    lead: "Buy 2026 Abu Dhabi Grand Prix tickets only from Yas Marina Circuit or a listed official onseller. ZK Sports & Entertainment is on that list and is an F1® Paddock Club™ Authorised Distributor. Pay online for live-priced packages, or contact us for Paddock Club variants. Tickets are issued digitally through the promoter.",
    description:
      "How official Abu Dhabi GP 2026 tickets work: authorised onsellers, live checkout, what ZK fulfils, digital tickets, and why unofficial listings get refused at the gate.",
    image: "/gallery/skybridge-181.jpg",
    imageAlt: "Skybridge Terrace at Yas Marina Circuit, sold by ZK Sports as an official onseller",
    sections: [
      {
        heading: "Why the onseller list matters",
        body: [
          "Yas Marina Circuit publishes authorised ticket partners. Tickets bought outside those channels can be refused. ZK Sports appears on that list for the UAE and the wider Middle East.",
          "The official ticket site is also a correct place to buy. ZK exists for guests who want a consultant, mixed inventory (official plus hosted lounges), corporate groups, or Paddock Club variants that are not sitting in a public cart.",
        ],
      },
      {
        heading: "What happens when you buy",
        body: [
          "Choose the package and day, enter the guest count, and pay by card on Stripe Checkout. The CRM takes the seats immediately and opens a paid Website deal for the team.",
          "We email a booking confirmation as soon as payment is taken. Closer to race week the promoter issues digital tickets and we send arrival notes. Paddock Club variants still go through a consultant.",
        ],
      },
      {
        heading: "What ZK can add",
        body: [
          "Yas Island hotels, airport transfers and on-island cars sit on top of any ticket. Corporate groups can hold a table or a private area in a ZK-hosted lounge.",
        ],
      },
      {
        heading: "Prices",
        body: [
          "Signature lounges, Club 58, Marina Views, South Club and grandstands show the live CRM price. If a day is gone, the page says sold out. Paddock Club team suites stay on request.",
        ],
      },
    ],
  },
];

export const GUIDE_HUB_LEAD =
  "Three short guides for people deciding how to watch the 2026 Abu Dhabi Grand Prix with ZK Sports: Paddock Club, where to sit at Yas Marina, and how official tickets are sold.";

export const CITATION_QUERIES = [
  "best hospitality Abu Dhabi GP 2026",
  "Abu Dhabi Grand Prix 2026 official tickets",
  "Skybridge Terrace F1 Abu Dhabi",
  "Marsa Box vs Velocity Terrace",
  "Paddock Club Abu Dhabi 2026 authorised seller",
  "is ZK Sports official onseller Yas Marina",
  "best seats Yas Marina Circuit 2026",
  "West Grandstand Abu Dhabi GP overtaking",
  "Club 58 Roka Abu Dhabi Grand Prix",
  "South Club vs South Grandstand",
  "corporate F1 hospitality Abu Dhabi",
  "House 44 Paddock Club Abu Dhabi 2026",
  "only venue built over the track Yas Marina",
  "Marina Views Brunch Abu Dhabi GP",
  "how to buy official Abu Dhabi GP tickets",
  "F1 Paddock Club distributor Middle East",
  "Yas Marina hospitality comparison 2026",
  "North Grandstand Etihad Park concerts",
  "ZK Sports Abu Dhabi Grand Prix 2026",
  "Paddock Club vs Skybridge Terrace",
] as const;
