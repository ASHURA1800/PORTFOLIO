import { NextRequest } from 'next/server';
import { gte, desc } from 'drizzle-orm';
import { db, analytics } from '@/lib/db';
import { analyticsSchema } from '@/lib/validation/schemas';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, validationError, rateLimitError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── POST /api/analytics — track an event (public, rate-limited) ───────────────
export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const rl = rateLimit({ key: `analytics:${ip}`, limit: 60, windowMs: 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = analyticsSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    await db.insert(analytics).values({
      event_type: parsed.data.event_type,
      metadata: parsed.data.metadata,
      ip_address: ip,
      user_agent: req.headers.get('user-agent') ?? undefined,
      referrer: req.headers.get('referer') ?? parsed.data.referrer,
    });
  } catch (e) {
    console.error('[Analytics] Insert error:', e);
    // Silently succeed — analytics should never break user experience
  }

  return ok(null, 'Event tracked');
}

// ── GET /api/analytics — admin dashboard stats ────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const url = new URL(req.url);
  const days = Math.min(365, Math.max(1, Number(url.searchParams.get('days') ?? 30)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // All events in the window + last 20 events
  const [events, recent] = await Promise.all([
    db
      .select({ event_type: analytics.event_type, created_at: analytics.created_at })
      .from(analytics)
      .where(gte(analytics.created_at, since)),
    db.select().from(analytics).orderBy(desc(analytics.created_at)).limit(20),
  ]);

  // Aggregate counts per event type
  const eventCounts: Record<string, number> = {};
  for (const row of events) {
    eventCounts[row.event_type] = (eventCounts[row.event_type] ?? 0) + 1;
  }

  // Daily breakdown (last N days)
  const dailyMap: Record<string, number> = {};
  for (const row of events) {
    const day = row.created_at.toISOString().slice(0, 10);
    dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }
  const daily = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return ok({
    period: { days, since: since.toISOString() },
    total: events.length,
    byType: eventCounts,
    daily,
    recent,
  });
}
