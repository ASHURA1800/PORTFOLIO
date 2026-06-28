import { NextRequest } from 'next/server';
import { certificationSchema, paginationSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/certifications — public ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit, order } = params.success
    ? params.data
    : { page: 1, limit: 20, order: 'asc' as const };

  const from = (page - 1) * limit;
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('certifications')
    .select('*', { count: 'exact' })
    .order('order_index', { ascending: true })
    .order('issued_date', { ascending: order === 'asc' })
    .range(from, from + limit - 1);

  if (error) return err('Failed to fetch certifications', 500);

  return ok({
    items: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}

// ── POST /api/certifications — admin create ───────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = certificationSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('certifications')
    .insert(parsed.data as any)
    .select()
    .single();

  if (error) return err(`Failed to create certification: ${error.message}`, 500);
  return created(data, 'Certification created');
}
