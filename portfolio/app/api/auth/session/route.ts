import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/services/response';

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return err('Not authenticated', 401);

  return ok({
    user: {
      id: user.id,
      email: user.email,
      isAdmin: user.email === process.env.ADMIN_EMAIL,
    },
  });
}
