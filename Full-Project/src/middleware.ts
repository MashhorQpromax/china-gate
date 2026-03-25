import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Routes that don't need authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/tracking/session',
  '/api/tracking/events',
];

// Routes that need specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard/admin': ['admin'],
  '/dashboard/buyer': ['gulf_buyer'],
  '/dashboard/supplier': ['chinese_supplier'],
  '/dashboard/manufacturer': ['gulf_manufacturer'],
};

// Admin-only API routes
const ADMIN_API_ROUTES = [
  '/api/analytics/audit',
  '/api/analytics/migrations',
  '/api/admin',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.') // files with extensions
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token in cookie or Authorization header
  const tokenFromCookie = request.cookies.get('access_token')?.value;
  const tokenFromHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    // API routes return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    // Pages redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token with Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid or expired token', code: 'TOKEN_EXPIRED' },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('access_token');
      return response;
    }

    // Get user profile for role checking
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('account_type, account_status')
      .eq('id', user.id)
      .single();

    // Check if account is suspended
    if (profile?.account_status === 'suspended') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Account suspended', code: 'ACCOUNT_SUSPENDED' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/login?error=suspended', request.url));
    }

    // Check role-based access for dashboard routes
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(profile?.account_type || '')) {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { error: 'Access denied', code: 'FORBIDDEN' },
              { status: 403 }
            );
          }
          // Redirect to correct dashboard
          const dashboardMap: Record<string, string> = {
            'gulf_buyer': '/dashboard/buyer',
            'chinese_supplier': '/dashboard/supplier',
            'gulf_manufacturer': '/dashboard/manufacturer',
            'admin': '/dashboard/admin',
          };
          const correctDashboard = dashboardMap[profile?.account_type || ''] || '/';
          return NextResponse.redirect(new URL(correctDashboard, request.url));
        }
      }
    }

    // Check admin-only API routes
    if (ADMIN_API_ROUTES.some(r => pathname.startsWith(r))) {
      if (profile?.account_type !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required', code: 'ADMIN_ONLY' },
          { status: 403 }
        );
      }
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');
    requestHeaders.set('x-user-role', profile?.account_type || '');

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (err) {
    console.error('Middleware auth error:', err);
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication error', code: 'AUTH_ERROR' },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
