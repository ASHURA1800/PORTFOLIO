import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE } from '@/lib/auth/jwt';

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );
  // HSTS: only meaningful over HTTPS
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');

  // Verify JWT only for admin paths — public routes skip this entirely
  let isAdminUser = false;
  if (isAdminPath) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const user = await verifyToken(token);
    isAdminUser = !!user && user.email === process.env.ADMIN_EMAIL;
  }

  // Protect /admin/* — redirect unauthenticated requests to login
  if (isAdminPath && pathname !== '/admin/login' && !isAdminUser) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Redirect authenticated admin away from the login page
  if (pathname === '/admin/login' && isAdminUser) {
    return applySecurityHeaders(NextResponse.redirect(new URL('/admin', req.url)));
  }

  return applySecurityHeaders(NextResponse.next({ request: req }));
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static chunks)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public assets: images, fonts
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|ico)$).*)',
  ],
};
