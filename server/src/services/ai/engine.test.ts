import { describe, it, expect, beforeAll, vi } from 'vitest';
import { TripBriefSchema, ItinerarySchema, type TripBrief } from '../../schemas/trip.js';

// Keep tests network-free: stub geocoding so the engine never calls Nominatim.
vi.mock('../geocode.js', () => ({
  geocodePlace: vi.fn(async () => ({ lat: 35.0, lng: 135.0 })),
}));

// Ensure we exercise the NO-KEY fallback path regardless of local env.
import { config } from '../../config.js';
beforeAll(() => {
  config.ANTHROPIC_API_KEY = undefined;
});

const { generateItinerary, regenerateDay } = await import('./engine.js');

function brief(overrides: Partial<TripBrief> = {}): TripBrief {
  return TripBriefSchema.parse({
    travelers: { adults: 2 },
    occasion: null,
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    route: [
      { city: 'Kyoto', country: 'Japan', nights: 2 },
      { city: 'Osaka', country: 'Japan', nights: 1 },
    ],
    accommodationType: 'hotel',
    budgetPerNight: { min: 100, max: 200, currency: 'USD' },
    pace: 'balanced',
    diet: [],
    interests: 'temples, food',
    currency: 'USD',
    ...overrides,
  });
}

describe('generateItinerary (no-key fallback)', () => {
  it('returns a schema-valid itinerary', async () => {
    const result = await generateItinerary(brief());
    expect(() => ItinerarySchema.parse(result)).not.toThrow();
  });

  it('produces one day per night across the route', async () => {
    const result = await generateItinerary(brief());
    // 2 + 1 nights = 3 days
    expect(result.days).toHaveLength(3);
    expect(result.days.map((d) => d.city)).toEqual(['Kyoto', 'Kyoto', 'Osaka']);
    result.days.forEach((d, i) => expect(d.dayIndex).toBe(i));
  });

  it('respects pace activity counts', async () => {
    const relaxed = await generateItinerary(brief({ pace: 'relaxed' }));
    relaxed.days.forEach((d) => expect(d.activities).toHaveLength(2));

    const balanced = await generateItinerary(brief({ pace: 'balanced' }));
    balanced.days.forEach((d) => expect(d.activities).toHaveLength(3));

    const packed = await generateItinerary(brief({ pace: 'packed' }));
    packed.days.forEach((d) => expect(d.activities).toHaveLength(4));
  });

  it('keeps each day’s activity cost within the nightly budget max', async () => {
    const result = await generateItinerary(brief({ budgetPerNight: { min: 50, max: 80, currency: 'USD' } }));
    result.days.forEach((d) => {
      const total = d.activities.reduce((s, a) => s + (a.estCost ?? 0), 0);
      expect(total).toBeLessThanOrEqual(80);
    });
  });

  it('labels food activities for the chosen diet', async () => {
    const result = await generateItinerary(brief({ diet: ['veg'] }));
    const foodActivities = result.days.flatMap((d) => d.activities).filter((a) => a.category === 'food');
    expect(foodActivities.length).toBeGreaterThan(0);
    foodActivities.forEach((a) => expect(a.title.toLowerCase()).toContain('vegetarian'));
  });

  it('injects an occasion-specific item when an occasion is set', async () => {
    const result = await generateItinerary(brief({ occasion: 'honeymoon' }));
    const hasOccasion = result.days.some((d) =>
      d.activities.some((a) => a.title.toLowerCase().includes('honeymoon')),
    );
    expect(hasOccasion).toBe(true);
  });

  it('attaches simulated price options to accommodations', async () => {
    const result = await generateItinerary(brief());
    expect(result.accommodations.length).toBeGreaterThan(0);
    result.accommodations.forEach((acc) => {
      expect(acc.options && acc.options.length).toBeGreaterThan(0);
    });
  });

  it('every activity carries an aiRationale (transparency)', async () => {
    const result = await generateItinerary(brief());
    result.days.flatMap((d) => d.activities).forEach((a) => {
      expect(typeof a.aiRationale).toBe('string');
      expect((a.aiRationale ?? '').length).toBeGreaterThan(0);
    });
  });

  it('regenerateDay returns a schema-valid itinerary with the day swapped', async () => {
    const original = await generateItinerary(brief());
    const updated = await regenerateDay(brief(), original, 1);
    expect(() => ItinerarySchema.parse(updated)).not.toThrow();
    expect(updated.days).toHaveLength(original.days.length);
  });
});
