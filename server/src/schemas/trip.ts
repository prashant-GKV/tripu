import { z } from 'zod';

/**
 * Canonical domain contracts (source of truth on the server).
 * The client mirrors these in client/src/types/trip.ts — keep them in sync.
 */

// ─── Wizard output / AI input ───────────────────────────────────────────────────
export const TravelerCompositionSchema = z.object({
  adults: z.number().int().min(0).default(1),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
  elders: z.number().int().min(0).default(0),
});

export const OccasionSchema = z
  .enum(['birthday', 'anniversary', 'honeymoon', 'bachelorette'])
  .nullable()
  .optional();

export const RouteCitySchema = z.object({
  city: z.string().min(1),
  // Country is optional — the wizard may collect city names only; the engine
  // geocodes by city and tolerates an empty country.
  country: z.string().optional().default(''),
  nights: z.number().int().min(0).default(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const TripBriefSchema = z.object({
  travelers: TravelerCompositionSchema,
  occasion: OccasionSchema,
  startDate: z.string(), // ISO date
  endDate: z.string(),
  departureCity: z.string().optional(),
  route: z.array(RouteCitySchema).min(1),
  accommodationType: z.enum(['hotel', 'apartment', 'hostel', 'unique']).default('hotel'),
  budgetPerNight: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default('USD'),
  }),
  pace: z.enum(['relaxed', 'balanced', 'packed']).default('balanced'),
  // Free-form diet tags (veg/nonveg/egg/vegan/halal/…); the engine labels known ones.
  diet: z.array(z.string()).default([]),
  interests: z.string().default(''),
  currency: z.string().default('USD'),
});

// ─── AI structured output ───────────────────────────────────────────────────────
export const ItineraryActivitySchema = z.object({
  timeSlot: z.string(), // "morning" | "afternoon" | "evening" | "09:00"
  title: z.string(),
  description: z.string().optional(),
  category: z.string(), // food | sight | activity | transport | rest
  place: z.string().optional(), // geocodable place name
  lat: z.number().optional(),
  lng: z.number().optional(),
  estCost: z.number().optional(),
  bookingUrl: z.string().optional(),
  aiRationale: z.string().optional(),
});

export const ItineraryDaySchema = z.object({
  dayIndex: z.number().int(),
  date: z.string().optional(),
  city: z.string(),
  country: z.string(),
  summary: z.string().optional(),
  activities: z.array(ItineraryActivitySchema),
});

export const ItineraryAccommodationSchema = z.object({
  city: z.string(),
  name: z.string(),
  type: z.string(),
  pricePerNight: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  options: z
    .array(z.object({ provider: z.string(), price: z.number(), url: z.string().optional() }))
    .optional(),
});

export const ItinerarySchema = z.object({
  title: z.string(),
  currency: z.string().default('USD'),
  days: z.array(ItineraryDaySchema),
  accommodations: z.array(ItineraryAccommodationSchema).default([]),
  estTotalCost: z.number().optional(),
});

export type TravelerComposition = z.infer<typeof TravelerCompositionSchema>;
export type RouteCity = z.infer<typeof RouteCitySchema>;
export type TripBrief = z.infer<typeof TripBriefSchema>;
export type ItineraryActivity = z.infer<typeof ItineraryActivitySchema>;
export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;
export type ItineraryAccommodation = z.infer<typeof ItineraryAccommodationSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;
