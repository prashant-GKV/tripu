import { prisma } from '../db.js';
import type { Prisma } from '@prisma/client';
import type { Itinerary, TripBrief } from '../schemas/trip.js';

/**
 * Persistence helpers mapping the AI `Itinerary` contract into normalized Prisma
 * rows (Trip → TripCity → Day → Activity, plus Accommodation), and a loader that
 * reassembles a Trip into the client-facing `Trip` DTO.
 */

// ─── DTO shape (mirrors client/src/types/trip.ts `Trip`) ────────────────────────
export interface TripDTO {
  id: string;
  ownerId: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPublic: boolean;
  shareSlug: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  occasion?: string | null;
  brief?: TripBrief;
  itinerary?: Itinerary;
  createdAt?: string;
}

/** Summary DTO for tripboard listings (no heavy itinerary payload). */
export interface TripSummaryDTO {
  id: string;
  ownerId: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPublic: boolean;
  shareSlug: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  occasion?: string | null;
  createdAt?: string;
}

interface CreateTripInput {
  ownerId: string;
  brief: TripBrief;
  itinerary: Itinerary;
  isPublic?: boolean;
  status?: 'DRAFT' | 'PUBLISHED';
}

function preferencesFromBrief(brief: TripBrief): Prisma.InputJsonValue {
  return {
    accommodation: brief.accommodationType,
    budget: brief.budgetPerNight,
    pace: brief.pace,
    diet: brief.diet,
    interests: brief.interests,
    departureCity: brief.departureCity ?? null,
    route: brief.route,
  };
}

/**
 * Create a Trip and all nested rows in a single transaction. Returns the new
 * trip id; load the full DTO with `loadTrip`.
 */
export async function createTripFromItinerary(input: CreateTripInput): Promise<string> {
  const { ownerId, brief, itinerary } = input;

  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        ownerId,
        title: itinerary.title,
        status: input.status ?? 'PUBLISHED',
        isPublic: input.isPublic ?? true,
        startDate: brief.startDate ? new Date(brief.startDate) : null,
        endDate: brief.endDate ? new Date(brief.endDate) : null,
        currency: itinerary.currency ?? brief.currency,
        occasion: brief.occasion ?? null,
        travelerComposition: brief.travelers as unknown as Prisma.InputJsonValue,
        preferences: preferencesFromBrief(brief),
      },
    });

    // Cities (ordered route from the brief, enriched by any AI lat/lng on days).
    const cityIdByKey = new Map<string, string>();
    for (let i = 0; i < brief.route.length; i++) {
      const rc = brief.route[i]!;
      const city = await tx.tripCity.create({
        data: {
          tripId: trip.id,
          city: rc.city,
          country: rc.country,
          lat: rc.lat ?? null,
          lng: rc.lng ?? null,
          orderIndex: i,
          nights: rc.nights ?? 0,
        },
      });
      cityIdByKey.set(cityKey(rc.city, rc.country), city.id);
    }

    // Days + activities.
    for (const day of itinerary.days) {
      const cityId = cityIdByKey.get(cityKey(day.city, day.country)) ?? null;
      const createdDay = await tx.day.create({
        data: {
          tripId: trip.id,
          cityId,
          dayIndex: day.dayIndex,
          date: day.date ? new Date(day.date) : null,
          summary: day.summary ?? null,
        },
      });

      for (let a = 0; a < day.activities.length; a++) {
        const act = day.activities[a]!;
        await tx.activity.create({
          data: {
            dayId: createdDay.id,
            timeSlot: act.timeSlot ?? null,
            title: act.title,
            description: act.description ?? null,
            category: act.category ?? null,
            lat: act.lat ?? null,
            lng: act.lng ?? null,
            estCost: act.estCost ?? null,
            bookingUrl: act.bookingUrl ?? null,
            aiRationale: act.aiRationale ?? null,
            orderIndex: a,
          },
        });
      }
    }

    // Accommodations.
    for (const acc of itinerary.accommodations) {
      const cityId = cityIdByKey.get(cityKeyByCity(acc.city, brief)) ?? null;
      await tx.accommodation.create({
        data: {
          tripId: trip.id,
          cityId,
          name: acc.name,
          type: acc.type ?? null,
          pricePerNight: acc.pricePerNight ?? null,
          lat: acc.lat ?? null,
          lng: acc.lng ?? null,
          options: (acc.options ?? null) as Prisma.InputJsonValue,
        },
      });
    }

    return trip.id;
  });
}

/**
 * Replace all days/activities/accommodations for a trip with the supplied
 * itinerary (used by regenerate-day after the engine returns an updated trip).
 */
export async function replaceItinerary(tripId: string, itinerary: Itinerary): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const cities = await tx.tripCity.findMany({ where: { tripId } });
    const cityIdByKey = new Map<string, string>();
    for (const c of cities) cityIdByKey.set(cityKey(c.city, c.country), c.id);

    await tx.day.deleteMany({ where: { tripId } }); // cascades to activities
    await tx.accommodation.deleteMany({ where: { tripId } });

    for (const day of itinerary.days) {
      const cityId = cityIdByKey.get(cityKey(day.city, day.country)) ?? null;
      const createdDay = await tx.day.create({
        data: {
          tripId,
          cityId,
          dayIndex: day.dayIndex,
          date: day.date ? new Date(day.date) : null,
          summary: day.summary ?? null,
        },
      });
      for (let a = 0; a < day.activities.length; a++) {
        const act = day.activities[a]!;
        await tx.activity.create({
          data: {
            dayId: createdDay.id,
            timeSlot: act.timeSlot ?? null,
            title: act.title,
            description: act.description ?? null,
            category: act.category ?? null,
            lat: act.lat ?? null,
            lng: act.lng ?? null,
            estCost: act.estCost ?? null,
            bookingUrl: act.bookingUrl ?? null,
            aiRationale: act.aiRationale ?? null,
            orderIndex: a,
          },
        });
      }
    }

    for (const acc of itinerary.accommodations) {
      await tx.accommodation.create({
        data: {
          tripId,
          name: acc.name,
          type: acc.type ?? null,
          pricePerNight: acc.pricePerNight ?? null,
          lat: acc.lat ?? null,
          lng: acc.lng ?? null,
          options: (acc.options ?? null) as Prisma.InputJsonValue,
        },
      });
    }

    await tx.trip.update({
      where: { id: tripId },
      data: { title: itinerary.title, currency: itinerary.currency },
    });
  });
}

const tripWithRelations = {
  include: {
    cities: { orderBy: { orderIndex: 'asc' } },
    days: {
      orderBy: { dayIndex: 'asc' },
      include: { activities: { orderBy: { orderIndex: 'asc' } } },
    },
    accommodations: true,
  },
} satisfies Prisma.TripDefaultArgs;

type TripWithRelations = Prisma.TripGetPayload<typeof tripWithRelations>;

/** Load a single trip and reassemble the full client DTO (incl. itinerary). */
export async function loadTrip(tripId: string): Promise<TripDTO | null> {
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, ...tripWithRelations });
  if (!trip) return null;
  return toDTO(trip);
}

/** Load a public trip by share slug (browse-before-login). */
export async function loadTripBySlug(slug: string): Promise<TripDTO | null> {
  const trip = await prisma.trip.findUnique({ where: { shareSlug: slug }, ...tripWithRelations });
  if (!trip) return null;
  return toDTO(trip);
}

/** Rebuild the `Itinerary` contract from persisted rows (engine context input). */
export function tripToItinerary(trip: TripWithRelations): Itinerary {
  return buildItinerary(trip);
}

/** Rebuild a `TripBrief` from persisted rows (engine context input). */
export function tripToBrief(trip: TripWithRelations): TripBrief {
  const prefs = (trip.preferences ?? {}) as Record<string, unknown>;
  const travelers = (trip.travelerComposition ?? {}) as Record<string, unknown>;
  const budget = (prefs.budget ?? {}) as Record<string, unknown>;

  return {
    travelers: {
      adults: Number(travelers.adults ?? 1),
      children: Number(travelers.children ?? 0),
      infants: Number(travelers.infants ?? 0),
      elders: Number(travelers.elders ?? 0),
    },
    occasion: (trip.occasion as TripBrief['occasion']) ?? null,
    startDate: trip.startDate ? trip.startDate.toISOString() : '',
    endDate: trip.endDate ? trip.endDate.toISOString() : '',
    departureCity: (prefs.departureCity as string | null) ?? undefined,
    route: trip.cities.map((c) => ({
      city: c.city,
      country: c.country,
      nights: c.nights,
      lat: c.lat ?? undefined,
      lng: c.lng ?? undefined,
    })),
    accommodationType: (prefs.accommodation as TripBrief['accommodationType']) ?? 'hotel',
    budgetPerNight: {
      min: Number(budget.min ?? 0),
      max: Number(budget.max ?? 0),
      currency: String(budget.currency ?? trip.currency),
    },
    pace: (prefs.pace as TripBrief['pace']) ?? 'balanced',
    diet: (prefs.diet as TripBrief['diet']) ?? [],
    interests: String(prefs.interests ?? ''),
    currency: trip.currency,
  };
}

/** Convenience loader returning the raw relation payload (for engine context). */
export async function loadTripWithRelations(tripId: string): Promise<TripWithRelations | null> {
  return prisma.trip.findUnique({ where: { id: tripId }, ...tripWithRelations });
}

export function toSummaryDTO(trip: {
  id: string;
  ownerId: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPublic: boolean;
  shareSlug: string;
  startDate: Date | null;
  endDate: Date | null;
  currency: string;
  occasion: string | null;
  createdAt: Date;
}): TripSummaryDTO {
  return {
    id: trip.id,
    ownerId: trip.ownerId,
    title: trip.title,
    status: trip.status,
    isPublic: trip.isPublic,
    shareSlug: trip.shareSlug,
    startDate: trip.startDate?.toISOString(),
    endDate: trip.endDate?.toISOString(),
    currency: trip.currency,
    occasion: trip.occasion,
    createdAt: trip.createdAt.toISOString(),
  };
}

// ─── internals ──────────────────────────────────────────────────────────────────
function toDTO(trip: TripWithRelations): TripDTO {
  return {
    id: trip.id,
    ownerId: trip.ownerId,
    title: trip.title,
    status: trip.status,
    isPublic: trip.isPublic,
    shareSlug: trip.shareSlug,
    startDate: trip.startDate?.toISOString(),
    endDate: trip.endDate?.toISOString(),
    currency: trip.currency,
    occasion: trip.occasion,
    brief: tripToBrief(trip),
    itinerary: buildItinerary(trip),
    createdAt: trip.createdAt.toISOString(),
  };
}

function buildItinerary(trip: TripWithRelations): Itinerary {
  const cityById = new Map(trip.cities.map((c) => [c.id, c]));
  return {
    title: trip.title,
    currency: trip.currency,
    days: trip.days.map((d) => {
      const c = d.cityId ? cityById.get(d.cityId) : undefined;
      return {
        id: d.id,
        dayIndex: d.dayIndex,
        date: d.date?.toISOString(),
        city: c?.city ?? '',
        country: c?.country ?? '',
        summary: d.summary ?? undefined,
        activities: d.activities.map((a) => ({
          id: a.id,
          timeSlot: a.timeSlot ?? '',
          title: a.title,
          description: a.description ?? undefined,
          category: a.category ?? '',
          lat: a.lat ?? undefined,
          lng: a.lng ?? undefined,
          estCost: a.estCost ?? undefined,
          bookingUrl: a.bookingUrl ?? undefined,
          aiRationale: a.aiRationale ?? undefined,
        })),
      };
    }),
    accommodations: trip.accommodations.map((acc) => {
      const c = acc.cityId ? cityById.get(acc.cityId) : undefined;
      return {
        id: acc.id,
        city: c?.city ?? '',
        name: acc.name,
        type: acc.type ?? '',
        pricePerNight: acc.pricePerNight ?? undefined,
        lat: acc.lat ?? undefined,
        lng: acc.lng ?? undefined,
        options: (acc.options as Itinerary['accommodations'][number]['options']) ?? undefined,
      };
    }),
  };
}

function cityKey(city: string, country: string): string {
  return `${city.trim().toLowerCase()}|${country.trim().toLowerCase()}`;
}

function cityKeyByCity(city: string, brief: TripBrief): string {
  const match = brief.route.find((r) => r.city.trim().toLowerCase() === city.trim().toLowerCase());
  return match ? cityKey(match.city, match.country) : cityKey(city, '');
}
