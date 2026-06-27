import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, rateLimitError } from '@/lib/services/response';

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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return err('Invalid email or password', 401);
  }

  // Confirm they are the admin
  if (data.user.email !== process.env.ADMIN_EMAIL) {
    await supabase.auth.signOut();
    return err('Unauthorized', 403);
  }

  return ok(
    { user: { id: data.user.id, email: data.user.email } },
    'Logged in successfully'
  );
}
