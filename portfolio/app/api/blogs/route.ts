import { NextRequest } from 'next/server';
import { blogSchema, paginationSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/blogs ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { page, limit, search, order } = paginationSchema.parse(
    Object.fromEntries(url.searchParams)
  );

  // Only admins can see unpublished posts
  const auth = await requireAdmin(req).catch(() => null);
  const isAdminRequest = auth && !(auth instanceof Response);

  const supabase = await createClient();
  const from = (page - 1) * limit;

  let query = supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: order === 'asc' });

  // Public users only see published posts
  if (!isAdminRequest) query = query.eq('published', true);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,excerpt.ilike.%${search}%,tags.cs.{${search}}`
    );
  }

  const { data, error, count } = await query.range(from, from + limit - 1);
  if (error) return err('Failed to fetch blogs', 500);

  return ok({
    items: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}

// ── POST /api/blogs ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blogs')
    .insert(parsed.data as any)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return err('A blog with this slug already exists', 409);
    return err(`Failed to create blog: ${error.message}`, 500);
  }
  return created(data, 'Blog created');
}
