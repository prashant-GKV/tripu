import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { TripBriefSchema } from '../schemas/trip.js';
import { generateItinerary, regenerateDay } from '../services/ai/engine.js';
import { requireAuth, getUserId } from '../auth/middleware.js';
import { broadcastActivityUpdate } from '../sockets/collab.js';
import {
  createTripFromItinerary,
  loadTrip,
  loadTripBySlug,
  loadTripWithRelations,
  replaceItinerary,
  toSummaryDTO,
  tripToBrief,
} from '../services/tripPersistence.js';

/**
 * Trip / tripboard routes (registered under /api by app.ts).
 *
 *   POST  /trips                   (auth) create + AI-generate, publish, return DTO
 *   GET   /trips                   (auth) list my trips (summaries)
 *   GET   /trips/:id               owner or public → full DTO
 *   GET   /t/:slug                 public trip by shareSlug (no auth)
 *   GET   /tripboards              public PUBLISHED trips (summaries)
 *   PATCH /activities/:id          update an activity + broadcast to collab room
 *   POST  /trips/:id/regenerate-day (auth) regenerate one day via the engine
 */

const ActivityPatchSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    timeSlot: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    estCost: z.number().optional(),
    bookingUrl: z.string().optional(),
    aiRationale: z.string().optional(),
    orderIndex: z.number().int().optional(),
  })
  .strict();

const RegenerateDaySchema = z.object({ dayIndex: z.number().int().min(0) });

export async function tripRoutes(app: FastifyInstance) {
  // ── Create + generate ──────────────────────────────────────────────────────────
  app.post('/trips', { preHandler: requireAuth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: 'unauthorized' });

    const body = req.body as { brief?: unknown };
    const parsed = TripBriefSchema.safeParse(body?.brief);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_brief', details: parsed.error.flatten() });
    }

    let itinerary;
    try {
      itinerary = await generateItinerary(parsed.data);
    } catch (err) {
      app.log.error({ err }, 'generateItinerary failed');
      return reply.status(502).send({ error: 'ai_generation_failed' });
    }

    const tripId = await createTripFromItinerary({
      ownerId: userId,
      brief: parsed.data,
      itinerary,
      isPublic: true,
      status: 'PUBLISHED',
    });

    const dto = await loadTrip(tripId);
    return reply.status(201).send({ trip: dto });
  });

  // ── List my trips ───────────────────────────────────────────────────────────────
  app.get('/trips', { preHandler: requireAuth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: 'unauthorized' });
    const trips = await prisma.trip.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return { trips: trips.map(toSummaryDTO) };
  });

  // ── Public tripboard listing ──────────────────────────────────────────────────
  app.get('/tripboards', async () => {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true, status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });
    return { trips: trips.map(toSummaryDTO) };
  });

  // ── Public trip by share slug (no auth — browse before login) ──────────────────
  app.get('/t/:slug', async (req, reply) => {
    const { slug } = req.params as { slug: string };
    const dto = await loadTripBySlug(slug);
    if (!dto || !dto.isPublic) return reply.status(404).send({ error: 'not_found' });
    return { trip: dto };
  });

  // ── Single trip (owner or public) ──────────────────────────────────────────────
  app.get('/trips/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const dto = await loadTrip(id);
    if (!dto) return reply.status(404).send({ error: 'not_found' });

    if (!dto.isPublic) {
      const userId = getUserId(req);
      if (!userId || userId !== dto.ownerId) {
        return reply.status(403).send({ error: 'forbidden' });
      }
    }
    return { trip: dto };
  });

  // ── Patch an activity (collab edits) ──────────────────────────────────────────
  app.patch('/activities/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = ActivityPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_patch', details: parsed.error.flatten() });
    }

    const existing = await prisma.activity.findUnique({
      where: { id },
      include: { day: { select: { tripId: true } } },
    });
    if (!existing) return reply.status(404).send({ error: 'not_found' });

    const updated = await prisma.activity.update({ where: { id }, data: parsed.data });

    const tripId = existing.day.tripId;
    broadcastActivityUpdate(tripId, { activityId: id, patch: parsed.data, activity: updated });

    return { activity: updated };
  });

  // ── Regenerate a single day ────────────────────────────────────────────────────
  app.post('/trips/:id/regenerate-day', { preHandler: requireAuth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: 'unauthorized' });

    const { id } = req.params as { id: string };
    const parsed = RegenerateDaySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request', details: parsed.error.flatten() });
    }

    const trip = await loadTripWithRelations(id);
    if (!trip) return reply.status(404).send({ error: 'not_found' });
    if (trip.ownerId !== userId) return reply.status(403).send({ error: 'forbidden' });

    const brief = tripToBrief(trip);
    const current = (await loadTrip(id))!.itinerary!;

    let regenerated;
    try {
      regenerated = await regenerateDay(brief, current, parsed.data.dayIndex);
    } catch (err) {
      app.log.error({ err }, 'regenerateDay failed');
      return reply.status(502).send({ error: 'ai_generation_failed' });
    }

    await replaceItinerary(id, regenerated);
    const dto = await loadTrip(id);
    return { trip: dto };
  });
}
