import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

/**
 * Liveness + readiness. `/health` checks the process; `/health/db` also pings
 * the database so we can confirm Postgres connectivity during setup.
 */
export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    service: 'tripu-server',
    time: new Date().toISOString(),
  }));

  app.get('/health/db', async (_req, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'reachable' };
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ status: 'error', db: 'unreachable' });
    }
  });
}
