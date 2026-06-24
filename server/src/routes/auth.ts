import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { issueOtp, verifyOtp } from '../services/otp.js';
import { requireAuth, getUserId } from '../auth/middleware.js';

/**
 * Auth routes (registered under /api by app.ts).
 *
 *   POST /auth/request-otp  { email }          → issue + send OTP
 *   POST /auth/verify-otp   { email, code }    → verify, upsert Profile, sign JWT
 *   GET  /auth/me           (requireAuth)      → current Profile
 *   GET  /auth/google       (+ callback)       → Google OAuth (only if configured)
 *
 * JWT payload: { sub: profile.id }.
 */

const RequestOtpSchema = z.object({ email: z.string().email() });
const VerifyOtpSchema = z.object({ email: z.string().email(), code: z.string().min(1) });

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'traveler';
  return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Upsert a Profile by email; mark verified once they pass an auth flow. */
async function upsertProfile(opts: {
  email: string;
  displayName?: string;
  avatarUrl?: string;
  verified?: boolean;
}) {
  const email = opts.email.trim().toLowerCase();
  return prisma.profile.upsert({
    where: { email },
    update: {
      verified: opts.verified ?? undefined,
      avatarUrl: opts.avatarUrl ?? undefined,
    },
    create: {
      email,
      displayName: opts.displayName ?? displayNameFromEmail(email),
      avatarUrl: opts.avatarUrl ?? null,
      verified: opts.verified ?? false,
    },
  });
}

export async function authRoutes(app: FastifyInstance) {
  // ── Email OTP ────────────────────────────────────────────────────────────────
  app.post('/auth/request-otp', async (req, reply) => {
    const parsed = RequestOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request', details: parsed.error.flatten() });
    }
    await issueOtp(parsed.data.email);
    return { ok: true };
  });

  app.post('/auth/verify-otp', async (req, reply) => {
    const parsed = VerifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request', details: parsed.error.flatten() });
    }
    const { email, code } = parsed.data;
    const result = verifyOtp(email, code);
    if (!result.ok) {
      return reply.status(401).send({ error: 'invalid_otp', reason: result.reason });
    }

    const profile = await upsertProfile({ email, verified: true });
    const token = app.jwt.sign({ sub: profile.id });
    return { token, profile };
  });

  // ── Current user ──────────────────────────────────────────────────────────────
  app.get('/auth/me', { preHandler: requireAuth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: 'unauthorized' });
    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) return reply.status(404).send({ error: 'profile_not_found' });
    return { profile };
  });

  // ── Google OAuth (only when configured; server still boots without it) ─────────
  if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    await registerGoogleOAuth(app);
  } else {
    app.get('/auth/google', async (_req, reply) => {
      return reply.status(503).send({ error: 'google_oauth_not_configured' });
    });
  }
}

async function registerGoogleOAuth(app: FastifyInstance) {
  const { default: oauthPlugin } = await import('@fastify/oauth2');

  await app.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['openid', 'email', 'profile'],
    credentials: {
      client: {
        id: config.GOOGLE_CLIENT_ID!,
        secret: config.GOOGLE_CLIENT_SECRET!,
      },
      // GOOGLE_CONFIGURATION provided by the plugin.
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/api/auth/google',
    // Server-side callback that exchanges the code and signs our own JWT.
    callbackUri: `${serverBaseUrl()}/api/auth/google/callback`,
    callbackUriParams: { prompt: 'consent' },
  });

  app.get('/auth/google/callback', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const oauth = (app as unknown as {
        googleOAuth2: {
          getAccessTokenFromAuthorizationCodeFlow(
            req: FastifyRequest,
          ): Promise<{ token: { access_token: string } }>;
        };
      }).googleOAuth2;

      const { token } = await oauth.getAccessTokenFromAuthorizationCodeFlow(req);

      const userInfo = await fetchGoogleUserInfo(token.access_token);
      if (!userInfo.email) {
        return reply.status(400).send({ error: 'google_no_email' });
      }

      const profile = await upsertProfile({
        email: userInfo.email,
        displayName: userInfo.name,
        avatarUrl: userInfo.picture,
        verified: Boolean(userInfo.email_verified),
      });

      const jwt = app.jwt.sign({ sub: profile.id });

      // Redirect back to the client with the token in the fragment (SPA reads it).
      const redirect = `${config.CLIENT_ORIGIN.replace(/\/$/, '')}/auth/callback#token=${encodeURIComponent(jwt)}`;
      return reply.redirect(redirect);
    } catch (err) {
      app.log.error({ err }, 'google oauth callback failed');
      return reply.status(500).send({ error: 'google_oauth_failed' });
    }
  });
}

interface GoogleUserInfo {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`google userinfo failed: ${res.status}`);
  return (await res.json()) as GoogleUserInfo;
}

function serverBaseUrl(): string {
  const port = config.PORT;
  return process.env.SERVER_ORIGIN?.replace(/\/$/, '') ?? `http://localhost:${port}`;
}
