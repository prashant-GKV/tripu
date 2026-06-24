import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { scoreCompatibility, type MatchInput, type MatchBreakdown } from '../services/matching.js';

/**
 * Companion-matching routes — OWNER: server-ai agent.
 * POST /match/:tripId — compute matches between the trip owner and other
 *   Profiles via scoreCompatibility, upsert CompanionMatch rows, return ranked DTOs.
 * GET  /match/:tripId — return stored matches joined to Profile.
 * Registered under /api by app.ts → /api/match/:tripId.
 */
interface MatchDTO {
  candidateId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  breakdown: MatchBreakdown;
}

interface TripPreferences {
  pace?: string;
  budget?: { band?: string };
  budgetBand?: string;
  freeText?: string;
}

/** Derive a MatchInput for the trip owner from their Profile + the trip. */
function ownerInput(
  profile: {
    travelStyles: string[];
    budgetBand?: string | null;
    pacePref?: string | null;
  },
  trip: {
    startDate: Date | null;
    endDate: Date | null;
    preferences: unknown;
    cities: { city: string; country: string }[];
  },
): MatchInput {
  const prefs = (trip.preferences ?? {}) as TripPreferences;
  const destinations = trip.cities.flatMap((c) => [c.city, c.country]);
  return {
    travelStyles: profile.travelStyles ?? [],
    budgetBand: profile.budgetBand ?? prefs.budget?.band ?? prefs.budgetBand ?? null,
    pacePref: profile.pacePref ?? prefs.pace ?? null,
    destinations,
    startDate: trip.startDate ? trip.startDate.toISOString() : null,
    endDate: trip.endDate ? trip.endDate.toISOString() : null,
  };
}

/** Derive a MatchInput for a candidate profile (its own preferences). */
function candidateInput(profile: {
  travelStyles: string[];
  budgetBand?: string | null;
  pacePref?: string | null;
  homeCity?: string | null;
}): MatchInput {
  return {
    travelStyles: profile.travelStyles ?? [],
    budgetBand: profile.budgetBand ?? null,
    pacePref: profile.pacePref ?? null,
    destinations: profile.homeCity ? [profile.homeCity] : [],
    startDate: null,
    endDate: null,
  };
}

export async function matchRoutes(app: FastifyInstance) {
  app.post<{ Params: { tripId: string } }>('/match/:tripId', async (req, reply) => {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { owner: true, cities: true },
    });
    if (!trip) return reply.status(404).send({ error: 'TRIP_NOT_FOUND' });

    const owner = ownerInput(trip.owner, trip);

    const candidates = await prisma.profile.findMany({
      where: { id: { not: trip.ownerId } },
    });

    const ranked: MatchDTO[] = candidates
      .map((c) => {
        const { score, breakdown } = scoreCompatibility(owner, candidateInput(c));
        return {
          candidateId: c.id,
          displayName: c.displayName,
          avatarUrl: c.avatarUrl ?? undefined,
          score,
          breakdown,
        };
      })
      .sort((a, b) => b.score - a.score);

    // Upsert each computed match so GET can read them back.
    await Promise.all(
      ranked.map((m) =>
        prisma.companionMatch.upsert({
          where: { tripId_candidateId: { tripId, candidateId: m.candidateId } },
          create: {
            tripId,
            candidateId: m.candidateId,
            score: m.score,
            breakdown: { ...m.breakdown },
          },
          update: { score: m.score, breakdown: { ...m.breakdown } },
        }),
      ),
    );

    return reply.send({ matches: ranked });
  });

  app.get<{ Params: { tripId: string } }>('/match/:tripId', async (req, reply) => {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return reply.status(404).send({ error: 'TRIP_NOT_FOUND' });

    const rows = await prisma.companionMatch.findMany({
      where: { tripId },
      include: { candidate: true },
      orderBy: { score: 'desc' },
    });

    const matches: MatchDTO[] = rows.map((r) => ({
      candidateId: r.candidateId,
      displayName: r.candidate.displayName,
      avatarUrl: r.candidate.avatarUrl ?? undefined,
      score: r.score,
      breakdown: r.breakdown as unknown as MatchBreakdown,
    }));

    return reply.send({ matches });
  });
}
