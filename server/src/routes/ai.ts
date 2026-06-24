import type { FastifyInstance } from 'fastify';
import { TripBriefSchema } from '../schemas/trip.js';
import { generateItinerary } from '../services/ai/engine.js';

/**
 * AI engine routes — OWNER: server-ai agent.
 * POST /ai/preview — generate an itinerary from a TripBrief without persisting
 * (fast iteration / demos). Registered under /api by app.ts → /api/ai/preview.
 */
export async function aiRoutes(app: FastifyInstance) {
  app.post('/ai/preview', async (req, reply) => {
    const body = (req.body ?? {}) as { brief?: unknown };
    const parsed = TripBriefSchema.safeParse(body.brief);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'INVALID_BRIEF',
        issues: parsed.error.issues,
      });
    }

    try {
      const itinerary = await generateItinerary(parsed.data);
      return reply.send({ itinerary });
    } catch (err) {
      app.log.error(err);
      return reply.status(502).send({ error: 'AI_GENERATION_FAILED' });
    }
  });
}
