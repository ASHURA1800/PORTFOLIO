import { NextRequest } from 'next/server';
import { blogSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

// ── GET /api/blogs/:id  (id = UUID or slug) ───────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const query = supabase.from('blogs').select('*');
  const { data, error } = await (isUUID(id)
    ? query.eq('id', id)
    : query.eq('slug', id)
  ).single();

  if (error || !data) return err('Blog not found', 404);
  return ok(data);
}

// ── PATCH /api/blogs/:id ──────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = blogSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blogs')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) return err(`Update failed: ${error.message}`, 500);
  if (!data) return err('Blog not found', 404);
  return ok(data, 'Blog updated');
}

// ── DELETE /api/blogs/:id ─────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) return err(`Delete failed: ${error.message}`, 500);
  return ok(null, 'Blog deleted');
}
