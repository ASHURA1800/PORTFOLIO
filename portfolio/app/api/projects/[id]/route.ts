import { NextRequest } from 'next/server';
import { projectSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

// ── GET /api/projects/:id ─────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return err('Project not found', 404);
  return ok(data);
}

// ── PATCH /api/projects/:id ───────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('projects')
    .update(parsed.data as any)
    .eq('id', id)
    .select()
    .single();

  if (error) return err(`Update failed: ${error.message}`, 500);
  if (!data) return err('Project not found', 404);
  return ok(data, 'Project updated');
}

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return err(`Delete failed: ${error.message}`, 500);
  return ok(null, 'Project deleted');
}
