import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, certifications } from '@/lib/db';
import { certificationSchema } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [data] = await db.select().from(certifications).where(eq(certifications.id, id)).limit(1);
  if (!data) return err('Certification not found', 404);
  return ok(data);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = certificationSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(certifications)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(certifications.id, id))
      .returning();
    if (!data) return err('Certification not found', 404);
    return ok(data, 'Certification updated');
  } catch (e) {
    return err(`Update failed: ${(e as Error).message}`, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  try {
    await db.delete(certifications).where(eq(certifications.id, id));
    return ok(null, 'Certification deleted');
  } catch (e) {
    return err(`Delete failed: ${(e as Error).message}`, 500);
  }
}
