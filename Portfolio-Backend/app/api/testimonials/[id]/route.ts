import { NextRequest } from 'next/server';
import { testimonialSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
  if (error || !data) return err('Testimonial not found', 404);
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

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('testimonials').update(parsed.data).eq('id', id).select().single();
  if (error) return err(`Update failed: ${error.message}`, 500);
  if (!data) return err('Testimonial not found', 404);
  return ok(data, 'Testimonial updated');
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) return err(`Delete failed: ${error.message}`, 500);
  return ok(null, 'Testimonial deleted');
}
