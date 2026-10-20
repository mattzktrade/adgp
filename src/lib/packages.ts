/** Public-folder path, with spaces and punctuation encoded for use in src. */
const media = (path: string) => encodeURI(path);

export type Tier = "signature" | "official" | "grandstand";

export const TIERS: Record<Tier, { label: string; short: string }> = {
  signature: { label: "ZK Signature Lounges", short: "Signature" },
  official: { label: "Official Hospitality", short: "Official" },
  grandstand: { label: "Grandstands", short: "Grandstand" },
};

export type Pkg = {
  id: string;
  slug: string;
  name: string;
  tier: Tier;
  where: string;
  headline: string;
  sub: string;
  description: string;
  stats: { k: string; v: string }[];
  included: string[];
  image: string;
  gallery: string[];
  /** Full-bleed film at the top of the package page. */
  video?: string;
  /** Feature film in the large gallery slot. */
  reel?: string;
  /** Still from the feature film — not a gallery photo. */
  reelPoster?: string;
  hosted?: boolean;
  /** marker position on the circuit map viewBox */
  pin: { x: number; y: number };
};

export const EVENT = {
  name: "Abu Dhabi Grand Prix 2026",
  circuit: "Yas Marina Circuit",
  dates: "04 – 06 Dec 2026",
  lightsOutUtc: "2026-12-06T13:00:00Z",
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
    description:
      "Skybridge Terrace spans Yas Marina Circuit at W Abu Dhabi – Yas Island. The cars pass directly beneath you through Turns 11 to 14, with the superyachts of Yas Marina on the other side.",
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
    description:
      "A dynamic fusion of action, premium hospitality and entertainment. Built for individuals and corporations looking to impress clients, reward employees or enjoy the ultimate F1 experience.",
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
    description:
      "Velocity Terrace hospitality at Yas Marina with sweeping views of Turns 8–11, gourmet dining, premium open bar, live entertainment, racing simulators and Yasalam concert access. Guests aged 16 and over.",
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
    description:
      "Immerse yourself in the world of Formula 1®. Unique insights from true legends of the sport, and a front-row seat to what makes an F1® team tick. We can also access Paddock Club™ options such as Teams, House 44, Legend and more.",
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
    image: media("/paddock/1383ed_8dc512b466f74371b6e4ee36931dcbc3mv2.avif"),
    gallery: [
      media("/paddock/1383ed_987c3d71a13b4c01baba46345ab6f79emv2.avif"),
      media("/paddock/1383ed_4fcf511ff95440a88c4e3574d3c7e4abmv2.avif"),
      media("/paddock/1383ed_69b23fc47c8a4f8c926e0ae15e123b08mv2.avif"),
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
    description:
      "Roka's acclaimed cuisine, an elegant indoor suite with table seating and signature cocktails, and a balcony over high-speed racing.",
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
    image: media("/club 58/1383ed_87f1535852564790b94fe4a58de34337mv2.avif"),
    gallery: [
      media("/club 58/1383ed_1e79612ab73c488e89279bcaf3a9a6d6mv2.avif"),
      media("/club 58/1383ed_e9e27ba1c48142c5be8fc31ff5a15919mv2.avif"),
      media("/club 58/1383ed_46bf6012626441b29e41301d52957781mv2.avif"),
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
    description:
      "Premium hospitality, gourmet dining and breathtaking views of Yas Marina and its challenging corners, with the After-Race Concerts and exclusive benefits throughout the weekend.",
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
    image: media("/marina views/Marina_Race_Views_500x400.jpg"),
    gallery: [
      media("/marina views/image_group-1.jpg"),
      media("/marina views/ADGP-500×400-px_After Race Concerts.jpg"),
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
    description:
      "The definitive blend of celebration and comfort. Witness high-stakes battles on the sweeping hairpin, then retreat to the lounge for à la carte dining and a cash bar.",
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
    image: media("/south club/ADGP24_South Grandstand_Cards - 500x400px - 03.avif"),
    gallery: [
      media("/south club/Club_Card-500X400_02.avif"),
      media("/south club/ADGP-500×400-px_After Race Concerts.jpg"),
      media("/south club/ADGP-500×400 px_Driver-Appearances.jpg"),
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
    description: "High-speed, side-by-side battles in the final sector, with the yachts and W Abu Dhabi as backdrop.",
    stats: [
      { k: "T9", v: "Marsa Corner" },
      { k: "3 Days", v: "Grandstand ticket" },
      { k: "Concerts", v: "Thu–Sun" },
      { k: "Fanzone", v: "Included" },
    ],
    included: GRANDSTAND_INCLUDED,
    image: media("/south grandstand/ADGP_Web_South_1920x694px_V2.jpg"),
    gallery: [
      media("/south grandstand/ADGP24_South Grandstand_Cards - 500x400px - 01.avif"),
      media("/south grandstand/ADGP-500×400-px_After Race Concerts.jpg"),
      media("/south grandstand/Oasis_Area_Card-500X400_02.avif"),
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
    description:
      "Heavy braking and wheel-to-wheel battles before the cars blast onto the longest straight. Easy access to the concerts at Etihad Park.",
    stats: [
      { k: "T5", v: "Hairpin" },
      { k: "3 Days", v: "Grandstand ticket" },
      { k: "Etihad Park", v: "Next to concerts" },
      { k: "Fanzone", v: "Included" },
    ],
    included: GRANDSTAND_INCLUDED,
    image: media("/north grandstand/ADGP_Web_North_1920x694px_V2.jpg"),
    gallery: [
      media("/north grandstand/North-Grandstand_Cards-500x400px-03.avif"),
      media("/north grandstand/ADGP-500×400 px_Driver-Appearances.jpg"),
      media("/north grandstand/Oasis_Area_Card-500X400_02.avif"),
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
    description: "Cars at 300+ km/h on the longest straight, then high-stakes overtaking into Turns 6 and 7.",
    stats: [
      { k: "300+", v: "km/h" },
      { k: "T6–T7", v: "Overtaking zone" },
      { k: "3 Days", v: "Grandstand ticket" },
      { k: "Fanzone", v: "Included" },
    ],
    included: GRANDSTAND_INCLUDED,
    image: media("/west grandstand/ADGP_Web_West_Grandstand_1920x694px_V2.jpg"),
    gallery: [
      media("/west grandstand/West-Grandstand_Cards-500x400px-01.avif"),
      media("/west grandstand/ADGP-500×400-px_After Race Concerts.jpg"),
      media("/west grandstand/ADGP-500×400 px_Driver-Appearances.jpg"),
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
