import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';

/**
 * Auth seam shared by all routes. JWT issuance happens in the auth routes
 * (OTP / Google OAuth); routes should depend only on these two helpers.
 *
 * Dev convenience: when NODE_ENV !== 'production', an `x-dev-user` header acts as
 * the authenticated user id so the client can be developed before auth is wired.
 */

function devUserId(req: FastifyRequest): string | null {
  if (config.NODE_ENV === 'production') return null;
  const devUser = req.headers['x-dev-user'];
  return typeof devUser === 'string' && devUser.length > 0 ? devUser : null;
}

/** preHandler that rejects unauthenticated requests with 401. */
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  if (devUserId(req)) {
    return; // dev bypass; getUserId reads the header
  }
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'unauthorized' });
  }
}

/** Resolve the authenticated user id (JWT `sub`, or the dev header in dev). */
export function getUserId(req: FastifyRequest): string | null {
  const dev = devUserId(req);
  if (dev) return dev;
  const user = req.user as { sub?: string } | undefined;
  return user?.sub ?? null;
}
