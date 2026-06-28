import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { blogSchema } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

// ── GET /api/blogs/:id  (id = UUID or slug) ───────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [data] = await db
    .select()
    .from(blogs)
    .where(isUUID(id) ? eq(blogs.id, id) : eq(blogs.slug, id))
    .limit(1);

  if (!data) return err('Blog not found', 404);
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

  try {
    const [data] = await db
      .update(blogs)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(blogs.id, id))
      .returning();

    if (!data) return err('Blog not found', 404);
    return ok(data, 'Blog updated');
  } catch (e) {
    if ((e as { code?: string }).code === '23505') {
      return err('A blog with this slug already exists', 409);
    }
    return err(`Update failed: ${(e as Error).message}`, 500);
  }
}

// ── DELETE /api/blogs/:id ─────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;

  try {
    await db.delete(blogs).where(eq(blogs.id, id));
    return ok(null, 'Blog deleted');
  } catch (e) {
    return err(`Delete failed: ${(e as Error).message}`, 500);
  }
}
