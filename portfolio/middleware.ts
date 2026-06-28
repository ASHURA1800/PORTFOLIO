import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE } from '@/lib/auth/jwt';

// Routes that require admin authentication
const ADMIN_ROUTES = ['/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const response = NextResponse.next({ request: req });

  // ── Verify JWT session ────────────────────────────────────
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await verifyToken(token);
  const isAdminUser = !!user && user.email === process.env.ADMIN_EMAIL;

  // ── Protect /admin pages ──────────────────────────────────
  const isAdminPage = ADMIN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  if (isAdminPage && pathname !== '/admin/login') {
    if (!isAdminUser) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Redirect already-logged-in admin away from /admin/login ─
  if (pathname === '/admin/login' && isAdminUser) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // ── Security headers on all responses ────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
