import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { issueOtp, verifyOtp, _clearOtpStore } from './otp.js';

// The email service falls back to console.log when SMTP is unconfigured (test env),
// so issueOtp resolves without sending real mail.

describe('otp store', () => {
  beforeEach(() => {
    _clearOtpStore();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('verifies the correct code (happy path) and consumes it', async () => {
    const { code } = await issueOtp('Alice@Example.com');
    // Email normalization: case-insensitive lookup.
    expect(verifyOtp('alice@example.com', code)).toEqual({ ok: true });
    // Consumed — a second verify fails.
    expect(verifyOtp('alice@example.com', code)).toEqual({ ok: false, reason: 'not_found' });
  });

  it('rejects a wrong code', async () => {
    await issueOtp('bob@example.com');
    expect(verifyOtp('bob@example.com', '000000')).toEqual({ ok: false, reason: 'mismatch' });
  });

  it('rejects an unknown email', () => {
    expect(verifyOtp('nobody@example.com', '123456')).toEqual({ ok: false, reason: 'not_found' });
  });

  it('expires codes after the TTL', async () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);

    const { code } = await issueOtp('carol@example.com');

    // Advance just past the 10-minute TTL.
    vi.setSystemTime(now + 10 * 60 * 1000 + 1);
    expect(verifyOtp('carol@example.com', code)).toEqual({ ok: false, reason: 'expired' });
  });

  it('locks out after too many wrong attempts', async () => {
    await issueOtp('dave@example.com');
    for (let i = 0; i < 5; i++) {
      expect(verifyOtp('dave@example.com', 'wrong')).toEqual({ ok: false, reason: 'mismatch' });
    }
    // 6th attempt is locked out and the entry is purged.
    expect(verifyOtp('dave@example.com', 'wrong')).toEqual({
      ok: false,
      reason: 'too_many_attempts',
    });
  });
});
