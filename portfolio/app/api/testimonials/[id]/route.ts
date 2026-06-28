import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, testimonials } from '@/lib/db';
import { testimonialSchema } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [data] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  if (!data) return err('Testimonial not found', 404);
  return ok(data);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(testimonials)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    if (!data) return err('Testimonial not found', 404);
    return ok(data, 'Testimonial updated');
  } catch (e) {
    return err(`Update failed: ${(e as Error).message}`, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return ok(null, 'Testimonial deleted');
  } catch (e) {
    return err(`Delete failed: ${(e as Error).message}`, 500);
  }
}
