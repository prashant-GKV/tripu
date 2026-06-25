export type Trip = {
  slug: string;
  title: string;
  country: string;
  cover: string;
  days: number;
  budget: string;
  summary: string;
  cities: string[];
  tags: string[];
};

export const trips: Trip[] = [
  {
    slug: "kyoto-quiet-temples",
    title: "Kyoto: Quiet Temples & Tea",
    country: "Japan",
    cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    days: 6,
    budget: "$1.2k",
    summary: "Six relaxed days through Arashiyama, Higashiyama and Fushimi, with matcha breaks built in.",
    cities: ["Kyoto", "Osaka", "Nara"],
    tags: ["culture", "food", "relaxed"],
  },
  {
    slug: "lisbon-coast",
    title: "Lisbon to Lagos Coastline",
    country: "Portugal",
    cover: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
    days: 8,
    budget: "$1.5k",
    summary: "Pastéis, miradouros and Algarve cliffs — a coastal arc with sunset stops daily.",
    cities: ["Lisbon", "Sintra", "Lagos"],
    tags: ["beach", "food", "balanced"],
  },
  {
    slug: "iceland-ring",
    title: "Iceland Ring Road",
    country: "Iceland",
    cover: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=1200&q=80",
    days: 10,
    budget: "$2.6k",
    summary: "Waterfalls, glaciers and black sand — a full loop with strategic aurora windows.",
    cities: ["Reykjavik", "Vík", "Akureyri"],
    tags: ["nature", "road trip", "packed"],
  },
  {
    slug: "marrakech-atlas",
    title: "Marrakech & High Atlas",
    country: "Morocco",
    cover: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=1200&q=80",
    days: 7,
    budget: "$900",
    summary: "Medina mornings, Atlas afternoons, riad evenings — color, spice, and silence.",
    cities: ["Marrakech", "Imlil", "Essaouira"],
    tags: ["culture", "adventure", "balanced"],
  },
  {
    slug: "patagonia-w",
    title: "Patagonia W-Trek",
    country: "Chile",
    cover: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
    days: 9,
    budget: "$2.1k",
    summary: "Torres del Paine's classic W with hut-to-hut logistics and rest days in Puerto Natales.",
    cities: ["Puerto Natales", "Torres del Paine"],
    tags: ["hiking", "nature", "packed"],
  },
  {
    slug: "vietnam-north",
    title: "Northern Vietnam Loop",
    country: "Vietnam",
    cover: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    days: 8,
    budget: "$750",
    summary: "Hanoi, Ha Giang motorbike loop and a slow Ninh Bình finish among limestone karsts.",
    cities: ["Hanoi", "Ha Giang", "Ninh Bình"],
    tags: ["adventure", "food", "balanced"],
  },
];

export const companions = [
  { name: "Mara Lindqvist", country: "Sweden", score: 94, style: ["culture", "slow"], budget: "Mid", dates: "Jun 12 – Jun 22", avatar: "https://i.pravatar.cc/150?img=47", breakdown: { Style: 96, Budget: 92, Dates: 95, Pace: 90 } },
  { name: "Diego Ferraro", country: "Argentina", score: 88, style: ["food", "nightlife"], budget: "Mid", dates: "Jun 14 – Jun 24", avatar: "https://i.pravatar.cc/150?img=12", breakdown: { Style: 88, Budget: 90, Dates: 86, Pace: 88 } },
  { name: "Aiko Tanaka", country: "Japan", score: 82, style: ["nature", "photo"], budget: "Low", dates: "Jun 10 – Jun 20", avatar: "https://i.pravatar.cc/150?img=32", breakdown: { Style: 84, Budget: 78, Dates: 82, Pace: 86 } },
  { name: "Noah Bennett", country: "Canada", score: 79, style: ["hiking", "adventure"], budget: "High", dates: "Jun 18 – Jun 28", avatar: "https://i.pravatar.cc/150?img=68", breakdown: { Style: 80, Budget: 70, Dates: 84, Pace: 82 } },
  { name: "Priya Raman", country: "India", score: 91, style: ["culture", "food"], budget: "Mid", dates: "Jun 11 – Jun 21", avatar: "https://i.pravatar.cc/150?img=44", breakdown: { Style: 94, Budget: 90, Dates: 92, Pace: 88 } },
  { name: "Luca Romano", country: "Italy", score: 76, style: ["beach", "food"], budget: "High", dates: "Jun 15 – Jun 25", avatar: "https://i.pravatar.cc/150?img=14", breakdown: { Style: 74, Budget: 70, Dates: 80, Pace: 80 } },
];
