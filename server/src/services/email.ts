import { config } from '../config.js';

/**
 * Email delivery for auth OTP codes.
 *
 * In dev (no SMTP env configured) we simply `console.log` the code so the flow
 * is testable without a mail server. If SMTP_* env vars are present we lazily
 * load nodemailer and send a real message.
 */

interface SmtpEnv {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
  secure: boolean;
}

function readSmtpEnv(): SmtpEnv | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT ?? 587);
  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM ?? 'Tripu <no-reply@tripu.app>',
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
  };
}

/**
 * Send a one-time passcode to `to`. Resolves true if an email was actually sent
 * over SMTP, false if it was only logged to the console (dev fallback).
 */
export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const smtp = readSmtpEnv();

  if (!smtp) {
    // Dev fallback — never email in tests / local without SMTP configured.
    if (config.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log(`[email] OTP for ${to}: ${code} (SMTP not configured — dev log only)`);
    }
    return false;
  }

  // Lazy import so the module isn't required unless SMTP is actually configured.
  const nodemailer = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user && smtp.pass ? { user: smtp.user, pass: smtp.pass } : undefined,
  });

  await transport.sendMail({
    from: smtp.from,
    to,
    subject: 'Your Tripu sign-in code',
    text: `Your Tripu verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your Tripu verification code is <strong style="font-size:20px;letter-spacing:2px">${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  return true;
}
