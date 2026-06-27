import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/** Returns the current session user or null */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/** Returns the current user or null */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Checks if the current user is the portfolio admin */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  return user.email === process.env.ADMIN_EMAIL;
}

/**
 * Route handler guard — call at the top of any admin API route.
 * Returns { user } on success, or a 401/403 NextResponse on failure.
 */
export async function requireAdmin(
  _req?: NextRequest
): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getUser>>>} | NextResponse> {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: admin access only' },
      { status: 403 }
    );
  }

  return { user };
}

/** Type-guard: narrows the result of requireAdmin */
export function isAuthError(
  result: Awaited<ReturnType<typeof requireAdmin>>
): result is NextResponse {
  return result instanceof NextResponse;
}
