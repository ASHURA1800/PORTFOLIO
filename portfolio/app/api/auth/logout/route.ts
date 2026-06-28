import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/services/response';

export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return err('Logout failed', 500);
  return ok(null, 'Logged out successfully');
}
