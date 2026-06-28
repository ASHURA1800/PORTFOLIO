import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, projects } from '@/lib/db';
import { projectSchema } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

// ── GET /api/projects/:id ─────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [data] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  if (!data) return err('Project not found', 404);
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

  try {
    const [data] = await db
      .update(projects)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (!data) return err('Project not found', 404);
    return ok(data, 'Project updated');
  } catch (e) {
    return err(`Update failed: ${(e as Error).message}`, 500);
  }
}

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;

  try {
    await db.delete(projects).where(eq(projects.id, id));
    return ok(null, 'Project deleted');
  } catch (e) {
    return err(`Delete failed: ${(e as Error).message}`, 500);
  }
}
