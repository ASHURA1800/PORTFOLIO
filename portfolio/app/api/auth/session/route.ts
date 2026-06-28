import { NextRequest } from 'next/server';
import { getUser } from '@/lib/auth/session';
import { ok, err } from '@/lib/services/response';

export async function GET(_req: NextRequest) {
  const user = await getUser();

  if (!user) return err('Not authenticated', 401);

  return ok({
    user: {
      email: user.email,
      isAdmin: user.email === process.env.ADMIN_EMAIL,
    },
  });
}
