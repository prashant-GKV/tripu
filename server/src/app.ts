import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { config } from './config.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { tripRoutes } from './routes/trips.js';
import { aiRoutes } from './routes/ai.js';
import { matchRoutes } from './routes/match.js';
import { contentRoutes } from './routes/content.js';

/**
 * Build (but do not start) the Fastify instance. Kept separate from index.ts so
 * tests can spin the app up in-process. Routes are registered under /api.
 */
export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
          : undefined,
    },
  });

  // In development, reflect any localhost origin so the frontend connects on
  // whatever port it runs (Vite 5173, Lovable/TanStack 8080, etc.).
  app.register(cors, {
    origin: config.NODE_ENV === 'production' ? config.CLIENT_ORIGIN : true,
    credentials: true,
  });
  app.register(cookie);
  app.register(jwt, { secret: config.JWT_SECRET, cookie: { cookieName: 'token', signed: false } });

  // Health (unprefixed)
  app.register(healthRoutes);

  // Feature routes under /api
  app.register(contentRoutes, { prefix: '/api' });
  app.register(authRoutes, { prefix: '/api' });
  app.register(tripRoutes, { prefix: '/api' });
  app.register(aiRoutes, { prefix: '/api' });
  app.register(matchRoutes, { prefix: '/api' });

  return app;
}
