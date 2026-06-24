import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

/**
 * Public seed-content routes — OWNER: server-ai agent.
 * GET /destinations, GET /testimonials (clearly-labelled sample data).
 * Registered under /api by app.ts → /api/destinations, /api/testimonials.
 */
export async function contentRoutes(app: FastifyInstance) {
  app.get('/destinations', async (_req, reply) => {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: 'asc' },
    });
    return reply.send({ destinations });
  });

  app.get('/testimonials', async (_req, reply) => {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { author: 'asc' },
    });
    return reply.send({ testimonials });
  });
}
