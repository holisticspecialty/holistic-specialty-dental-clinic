import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security middleware — protects /staff/portal from unauthenticated access.
 *
 * This provides defense-in-depth by checking for the presence of Supabase
 * auth tokens at the edge BEFORE the page JS ever loads. The client-side
 * getUser() call in the portal page is the second layer of verification.
 *
 * Note: We check for the auth token cookie rather than verifying the JWT here
 * because full JWT verification requires the Supabase secret (not available
 * in middleware). The token is fully verified by getUser() on the client.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect staff portal routes
  if (pathname.startsWith('/staff/portal')) {
    // Supabase stores auth tokens in cookies with the project ref as prefix
    // Look for any sb-*-auth-token cookie
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) =>
        cookie.name.includes('-auth-token') ||
        cookie.name.includes('supabase-auth-token')
    );

    if (!hasAuthCookie) {
      const loginUrl = new URL('/staff', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy — don't leak full URL to external sites
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent the page from being loaded in an iframe (CSP frame-ancestors)
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self'"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *  - _next/static (static files)
     *  - _next/image (image optimization files)
     *  - favicon.ico, sitemap.xml, robots.txt (metadata files)
     *  - public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};
