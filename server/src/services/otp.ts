import { sendOtpEmail } from './email.js';

/**
 * In-memory one-time-passcode store. Suitable for a single-process self-hosted
 * deployment (the project's target). Codes expire after TTL_MS and are removed
 * on successful verification.
 */

interface OtpEntry {
  code: string;
  expires: number; // epoch ms
  attempts: number;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

const store = new Map<string, OtpEntry>();

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function generateCode(): string {
  // 6-digit numeric code (zero-padded).
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Issue a fresh OTP for `email`, store it, and send it via the email service. */
export async function issueOtp(email: string): Promise<{ code: string; expires: number }> {
  const key = normalize(email);
  const code = generateCode();
  const expires = Date.now() + TTL_MS;
  store.set(key, { code, expires, attempts: 0 });
  await sendOtpEmail(key, code);
  return { code, expires };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'expired' | 'mismatch' | 'too_many_attempts' };

/** Verify a submitted `code` for `email`. Consumes the OTP on success. */
export function verifyOtp(email: string, code: string): VerifyResult {
  const key = normalize(email);
  const entry = store.get(key);

  if (!entry) return { ok: false, reason: 'not_found' };

  if (Date.now() > entry.expires) {
    store.delete(key);
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (entry.code !== code.trim()) {
    entry.attempts += 1;
    return { ok: false, reason: 'mismatch' };
  }

  store.delete(key);
  return { ok: true };
}

/** Test helper — clear all stored OTPs. */
export function _clearOtpStore(): void {
  store.clear();
}
