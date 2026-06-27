import { NextRequest } from 'next/server';
import { contactSchema } from '@/lib/validation/schemas';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendContactNotification, sendContactAcknowledgement } from '@/lib/services/email';
import { ok, err, validationError, rateLimitError } from '@/lib/services/response';

export async function POST(req: NextRequest) {
  // ── Rate limit: 5 submissions per 15 minutes per IP ───────
  const ip = getIP(req);
  const rl = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  // ── Parse body ────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body');
  }

  // ── Validate ──────────────────────────────────────────────
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { website, ...data } = parsed.data;

  // ── Honeypot check ────────────────────────────────────────
  if (website) return err('Bot detected', 400);

  // ── Persist to Supabase ───────────────────────────────────
  const supabase = createAdminClient();
  const { data: contact, error: dbError } = await supabase
    .from('contacts')
    .insert({
      ...data,
      ip_address: ip,
      user_agent: req.headers.get('user-agent') ?? undefined,
    })
    .select()
    .single();

  if (dbError) {
    console.error('[Contact] DB error:', dbError);
    return err('Failed to save message. Please try again.', 500);
  }

  // ── Emails (non-blocking — don't fail the request) ────────
  Promise.all([
    sendContactNotification(data).catch((e) =>
      console.error('[Contact] Notification email failed:', e)
    ),
    sendContactAcknowledgement({ name: data.name, email: data.email }).catch((e) =>
      console.error('[Contact] Acknowledgement email failed:', e)
    ),
  ]);

  return ok({ id: contact.id }, 'Message sent successfully!', 201);
}

export async function GET(req: NextRequest) {
  // Admin-only: list all contacts
  const { requireAdmin, isAuthError } = await import('@/lib/auth/session');
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const supabase = createAdminClient();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 20)));
  const from = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) return err('Failed to fetch contacts', 500);

  return ok({
    items: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
