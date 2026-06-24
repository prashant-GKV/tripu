import { prisma } from '../src/db.js';

/**
 * Seed clearly-labelled SAMPLE data so the browse page and matching demo have
 * content without any real users. Idempotent-ish: we clear sample tables first.
 *
 * Run via `npm run db:seed` (tsx).
 */

const destinations = [
  { name: 'Kyoto', country: 'Japan', image: 'destination_kyoto.png', lat: 35.0116, lng: 135.7681, tags: ['culture', 'temples', 'food'] },
  { name: 'Bali', country: 'Indonesia', image: 'destination_bali.png', lat: -8.4095, lng: 115.1889, tags: ['beach', 'wellness', 'nature'] },
  { name: 'Reykjavik', country: 'Iceland', image: 'destination_iceland.png', lat: 64.1466, lng: -21.9426, tags: ['nature', 'adventure', 'aurora'] },
  { name: 'Patagonia', country: 'Argentina', image: 'destination_patagonia.png', lat: -49.3279, lng: -72.8864, tags: ['hiking', 'wilderness', 'adventure'] },
  { name: 'Lisbon', country: 'Portugal', image: null, lat: 38.7223, lng: -9.1393, tags: ['city', 'food', 'coast'] },
  { name: 'Marrakech', country: 'Morocco', image: null, lat: 31.6295, lng: -7.9811, tags: ['culture', 'markets', 'desert'] },
  { name: 'Queenstown', country: 'New Zealand', image: null, lat: -45.0312, lng: 168.6626, tags: ['adventure', 'nature', 'lakes'] },
  { name: 'Santorini', country: 'Greece', image: null, lat: 36.3932, lng: 25.4615, tags: ['romance', 'beach', 'views'] },
];

const testimonials = [
  { author: 'Aarav Mehta', location: 'Mumbai, India', avatar: 'profile2.png', quote: 'Tripu planned our 10-day Japan trip in minutes. The map view made everything click.', rating: 5, source: 'seed' },
  { author: 'Sofia Rossi', location: 'Milan, Italy', avatar: 'profile3.png', quote: 'I found a travel companion with the exact same pace and budget. Game changer.', rating: 5, source: 'seed' },
  { author: 'Liam O’Connor', location: 'Dublin, Ireland', avatar: 'profile4.png', quote: 'The itinerary respected our vegetarian diet without me lifting a finger.', rating: 4, source: 'seed' },
  { author: 'Mei Tanaka', location: 'Osaka, Japan', avatar: null, quote: 'Regenerating a single day when plans changed was effortless.', rating: 5, source: 'seed' },
  { author: 'Carlos Vega', location: 'Bogotá, Colombia', avatar: null, quote: 'Browsing public tripboards gave me so many ideas before signing up.', rating: 5, source: 'seed' },
  { author: 'Emma Schmidt', location: 'Berlin, Germany', avatar: null, quote: 'Transparent match scores meant I actually trusted the suggestions.', rating: 4, source: 'seed' },
];

const sampleProfiles = [
  { email: 'sample.maya@tripu.example', displayName: 'Maya (sample)', homeCity: 'Lisbon, Portugal', bio: 'Slow-travel foodie.', travelStyles: ['food', 'culture', 'photography'], budgetBand: 'mid', pacePref: 'relaxed', diet: 'veg' },
  { email: 'sample.kenji@tripu.example', displayName: 'Kenji (sample)', homeCity: 'Kyoto, Japan', bio: 'Temple hopper and tea lover.', travelStyles: ['culture', 'temples', 'food'], budgetBand: 'mid', pacePref: 'balanced', diet: 'nonveg' },
  { email: 'sample.nora@tripu.example', displayName: 'Nora (sample)', homeCity: 'Reykjavik, Iceland', bio: 'Cold-weather adventurer.', travelStyles: ['hiking', 'nature', 'adventure'], budgetBand: 'economy', pacePref: 'packed', diet: 'nonveg' },
  { email: 'sample.diego@tripu.example', displayName: 'Diego (sample)', homeCity: 'Buenos Aires, Argentina', bio: 'Mountains over cities.', travelStyles: ['hiking', 'wilderness', 'photography'], budgetBand: 'economy', pacePref: 'packed', diet: 'nonveg' },
  { email: 'sample.priya@tripu.example', displayName: 'Priya (sample)', homeCity: 'Mumbai, India', bio: 'Beach and wellness seeker.', travelStyles: ['beach', 'wellness', 'food'], budgetBand: 'luxury', pacePref: 'relaxed', diet: 'veg' },
];

async function main() {
  console.log('Seeding sample content…');

  // Clear sample-only tables (safe: these only ever hold seed data).
  await prisma.testimonial.deleteMany({});
  await prisma.destination.deleteMany({});

  await prisma.destination.createMany({ data: destinations });
  await prisma.testimonial.createMany({ data: testimonials });
  console.log(`  ✓ ${destinations.length} destinations, ${testimonials.length} testimonials`);

  // Sample profiles (upsert so re-running is safe and keeps relations stable).
  const profiles = [];
  for (const p of sampleProfiles) {
    const profile = await prisma.profile.upsert({
      where: { email: p.email },
      create: { ...p, verified: true },
      update: { ...p, verified: true },
    });
    profiles.push(profile);
  }
  console.log(`  ✓ ${profiles.length} sample profiles`);

  // Two public sample trips with Days + Activities.
  await seedPublicTrip(profiles[1].id, {
    title: 'Kyoto Culture Week (sample)',
    occasion: null,
    currency: 'USD',
    start: '2026-09-10',
    cities: [{ city: 'Kyoto', country: 'Japan', nights: 3, lat: 35.0116, lng: 135.7681 }],
    preferences: { accommodation: 'hotel', budget: { min: 120, max: 200, band: 'mid' }, pace: 'balanced', diet: ['nonveg'], freeText: 'temples and food' },
  });

  await seedPublicTrip(profiles[4].id, {
    title: 'Bali Wellness Escape (sample)',
    occasion: 'anniversary',
    currency: 'USD',
    start: '2026-11-02',
    cities: [{ city: 'Ubud', country: 'Indonesia', nights: 2, lat: -8.5069, lng: 115.2625 }],
    preferences: { accommodation: 'unique', budget: { min: 200, max: 400, band: 'luxury' }, pace: 'relaxed', diet: ['veg'], freeText: 'spa and rice terraces' },
  });

  console.log('  ✓ 2 public sample trips with days + activities');
  console.log('Done.');
}

interface PublicTripSpec {
  title: string;
  occasion: string | null;
  currency: string;
  start: string;
  cities: { city: string; country: string; nights: number; lat: number; lng: number }[];
  preferences: Record<string, unknown>;
}

async function seedPublicTrip(ownerId: string, spec: PublicTripSpec) {
  // Remove any prior sample trip with the same title for this owner.
  await prisma.trip.deleteMany({ where: { ownerId, title: spec.title } });

  const totalNights = spec.cities.reduce((s, c) => s + c.nights, 0);
  const startDate = new Date(`${spec.start}T00:00:00.000Z`);
  const endDate = new Date(startDate.getTime());
  endDate.setUTCDate(endDate.getUTCDate() + totalNights);

  const trip = await prisma.trip.create({
    data: {
      ownerId,
      title: spec.title,
      status: 'PUBLISHED',
      isPublic: true,
      startDate,
      endDate,
      currency: spec.currency,
      occasion: spec.occasion,
      travelerComposition: { adults: 2, children: 0, infants: 0, elders: 0 },
      preferences: spec.preferences as object,
    },
  });

  let dayIndex = 0;
  for (let i = 0; i < spec.cities.length; i++) {
    const c = spec.cities[i];
    const tripCity = await prisma.tripCity.create({
      data: { tripId: trip.id, city: c.city, country: c.country, lat: c.lat, lng: c.lng, orderIndex: i, nights: c.nights },
    });

    await prisma.accommodation.create({
      data: {
        tripId: trip.id,
        cityId: tripCity.id,
        name: `Sample stay in ${c.city}`,
        type: String((spec.preferences as { accommodation?: string }).accommodation ?? 'hotel'),
        pricePerNight: 150,
        lat: c.lat,
        lng: c.lng,
        options: [
          { provider: 'Tripu Direct', price: 142.5 },
          { provider: 'Booking (sample)', price: 150 },
        ],
      },
    });

    for (let n = 0; n < c.nights; n++) {
      const date = new Date(startDate.getTime());
      date.setUTCDate(date.getUTCDate() + dayIndex);
      const day = await prisma.day.create({
        data: { tripId: trip.id, cityId: tripCity.id, dayIndex, date, summary: `Day ${dayIndex + 1} in ${c.city}` },
      });

      await prisma.activity.createMany({
        data: [
          { dayId: day.id, timeSlot: 'morning', title: `Explore ${c.city}`, category: 'sight', lat: c.lat, lng: c.lng, estCost: 0, aiRationale: 'A relaxed morning to take in the city.', orderIndex: 0 },
          { dayId: day.id, timeSlot: 'afternoon', title: `Local lunch in ${c.city}`, category: 'food', lat: c.lat, lng: c.lng, estCost: 25, aiRationale: 'A local meal that fits the group’s diet.', orderIndex: 1 },
          { dayId: day.id, timeSlot: 'evening', title: `Evening stroll in ${c.city}`, category: 'activity', lat: c.lat, lng: c.lng, estCost: 15, aiRationale: 'A gentle close to the day.', orderIndex: 2 },
        ],
      });

      dayIndex++;
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
