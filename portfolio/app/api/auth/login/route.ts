import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signToken, sessionCookieOptions, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth/jwt';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { err, rateLimitError } from '@/lib/services/response';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `login:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return err('Invalid email or password', 400);

  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !passwordHash) {
    return err('Server auth is not configured', 500);
  }

  // Verify identity + password (constant-ish time: always run bcrypt)
  const emailMatches = parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = await bcrypt.compare(parsed.data.password, passwordHash);

  if (!emailMatches || !passwordMatches) {
    return err('Invalid email or password', 401);
  }

  const token = await signToken({ email: adminEmail });

  const res = NextResponse.json(
    { success: true, data: { user: { email: adminEmail } }, message: 'Logged in successfully' },
    { status: 200 }
  );
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
  return res;
}
