import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'vestiq-dev-jwt-super-secret-key-32-chars-long-minimum-secure';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'vestiq_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protected paths
  const isInvestorRoute = pathname.startsWith('/dashboard/investor') || pathname.startsWith('/onboarding/investor');
  const isBusinessRoute = pathname.startsWith('/dashboard/business');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isInvestorRoute && !isBusinessRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
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
