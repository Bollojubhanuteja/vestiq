import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const DEV_FALLBACK_SECRET = 'vestiq-dev-jwt-super-secret-key-32-chars-long-minimum-secure';

function getMiddlewareJwtSecretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

  if (!secret) {
    if (isProduction) {
      console.error('[SECURITY FATAL] JWT_SECRET missing in production middleware. Access denied.');
      return null;
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }

  if (isProduction && secret === DEV_FALLBACK_SECRET) {
    console.error('[SECURITY FATAL] Insecure default development JWT_SECRET used in production middleware. Access denied.');
    return null;
  }

  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = 'vestiq_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protected paths
  const isInvestorRoute = pathname.startsWith('/dashboard/investor') || pathname.startsWith('/onboarding/investor');
  const isBusinessRoute = pathname.startsWith('/dashboard/business');
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (!isInvestorRoute && !isBusinessRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL(isAdminRoute ? '/admin/login' : '/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const secretKey = getMiddlewareJwtSecretKey();
  if (!secretKey) {
    // Fail closed in production if secret is not properly configured
    const loginUrl = new URL(isAdminRoute ? '/admin/login' : '/login', req.url);
    loginUrl.searchParams.set('error', 'security_config_missing');
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const role = payload.role as string;

    // Admin access
    if (isAdminRoute) {
      if (role !== 'ADMIN') {
        const homeUrl = new URL('/', req.url);
        return NextResponse.redirect(homeUrl);
      }
      return NextResponse.next();
    }

    // Investor access
    if (isInvestorRoute) {
      if (role !== 'INVESTOR' && role !== 'ADMIN') {
        const bizUrl = new URL('/dashboard/business', req.url);
        return NextResponse.redirect(bizUrl);
      }
      return NextResponse.next();
    }

    // Business access
    if (isBusinessRoute) {
      if (role !== 'BUSINESS' && role !== 'ADMIN') {
        const invUrl = new URL('/dashboard/investor', req.url);
        return NextResponse.redirect(invUrl);
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/investor/:path*',
    '/dashboard/business/:path*',
    '/onboarding/investor/:path*',
    '/admin/:path*',
  ],
};
