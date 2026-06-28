import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signToken, sessionCookieOptions, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth/jwt';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, rateLimitError } from '@/lib/services/response';

const loginSchema = z.object({
  email: z.string().email(),
  // max(512): prevents bcrypt DoS from oversized inputs
  password: z.string().min(6).max(512),
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `login:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON', 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return err('Invalid email or password', 400);

  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !passwordHash) {
    return err('Server misconfiguration', 500);
  }

  // Always run bcrypt regardless of email match to prevent timing-based email enumeration
  const emailMatches = parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = await bcrypt.compare(parsed.data.password, passwordHash);

  if (!emailMatches || !passwordMatches) {
    return err('Invalid email or password', 401);
  }

  let token: string;
  try {
    token = await signToken({ email: adminEmail });
  } catch {
    return err('Failed to create session', 500);
  }

  const res = ok({ user: { email: adminEmail } }, 'Logged in successfully');
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
  return res;
}
