import { NextRequest } from 'next/server';
import { projectSchema, paginationSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/projects — public list with optional pagination & featured filter ─
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit, search, order } = params.success
    ? params.data
    : { page: 1, limit: 20, search: undefined, order: 'desc' as const };

  const featured = url.searchParams.get('featured');
  const from = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: order === 'asc' });

  if (featured === 'true') query = query.eq('featured', true);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query.range(from, from + limit - 1);

  if (error) return err('Failed to fetch projects', 500);

  return ok({
    items: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}

// ── POST /api/projects — admin create ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('projects')
    .insert(parsed.data)
    .select()
    .single();

  if (error) return err(`Failed to create project: ${error.message}`, 500);
  return created(data, 'Project created');
}
