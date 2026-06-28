import { NextRequest } from 'next/server';
import { analyticsSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
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

  const supabase = createAdminClient();
  const { error } = await supabase.from('analytics').insert({
    ...parsed.data,
    ip_address: ip,
    user_agent: req.headers.get('user-agent') ?? undefined,
    referrer: req.headers.get('referer') ?? parsed.data.referrer,
  });

  if (error) {
    console.error('[Analytics] Insert error:', error);
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
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const supabase = createAdminClient();

  // Parallel queries for dashboard metrics
  const [eventsRes, countsRes, recentRes] = await Promise.all([
    // All events in window
    supabase
      .from('analytics')
      .select('event_type, created_at', { count: 'exact' })
      .gte('created_at', since),

    // Count per event type
    supabase.rpc('get_analytics_counts', { since_date: since }).maybeSingle(),

    // Last 20 events
    supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  // Aggregate counts manually (fallback if RPC not defined)
  const eventCounts: Record<string, number> = {};
  for (const row of eventsRes.data ?? []) {
    eventCounts[row.event_type] = (eventCounts[row.event_type] ?? 0) + 1;
  }

  // Daily breakdown (last N days)
  const dailyMap: Record<string, number> = {};
  for (const row of eventsRes.data ?? []) {
    const day = row.created_at.slice(0, 10);
    dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }
  const daily = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return ok({
    period: { days, since },
    total: eventsRes.count ?? 0,
    byType: eventCounts,
    daily,
    recent: recentRes.data ?? [],
  });
}
