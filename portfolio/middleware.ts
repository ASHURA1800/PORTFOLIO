import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require admin authentication
const ADMIN_ROUTES = ['/admin'];
const ADMIN_API_ROUTES = [
  '/api/contact',       // GET (list) only
  '/api/analytics',     // GET only; POST is public
  '/api/storage',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Refresh Supabase session on every request ─────────────
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session (important: getUser, not getSession)
  const { data: { user } } = await supabase.auth.getUser();

  // ── Protect /admin pages ──────────────────────────────────
  const isAdminPage = ADMIN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  if (isAdminPage && pathname !== '/admin/login') {
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Redirect already-logged-in admin away from /admin/login ─
  if (pathname === '/admin/login' && user?.email === process.env.ADMIN_EMAIL) {
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
