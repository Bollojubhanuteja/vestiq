import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, SESSION_COOKIE_OPTIONS } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { desk } = body;

    if (desk !== 'FOUNDER' && desk !== 'COFOUNDER') {
      return NextResponse.json({ error: 'Invalid executive desk identifier' }, { status: 400 });
    }

    const targetEmail = desk === 'FOUNDER' ? 'vestiq21@gmail.com' : 'bhavana@vestiq.com';

    const user = await db.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Executive administration profile not initialized' },
        { status: 401 }
      );
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      role: 'ADMIN' as const,
      name: user.name,
    };

    const token = await signToken(sessionPayload);

    await trackEvent('EXECUTIVE_ACCESS', user.id, null, {
      desk,
      executive: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      redirectUrl: '/admin',
    });

    response.cookies.set({
      name: SESSION_COOKIE_OPTIONS.name,
      value: token,
      httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
      secure: SESSION_COOKIE_OPTIONS.secure,
      sameSite: SESSION_COOKIE_OPTIONS.sameSite,
      path: SESSION_COOKIE_OPTIONS.path,
      maxAge: SESSION_COOKIE_OPTIONS.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Executive access error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
