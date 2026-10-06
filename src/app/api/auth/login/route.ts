import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken, SESSION_COOKIE_OPTIONS } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        investorProfile: true,
        businessProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'INVESTOR' | 'BUSINESS' | 'ADMIN',
      name: user.name,
    };

    const token = await signToken(sessionPayload);

    // Track analytics
    await trackEvent('REGISTRATION', user.id, null, { action: 'LOGIN', role: user.role });

    const redirectUrl =
      user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'BUSINESS'
        ? '/dashboard/business'
        : user.investorProfile?.onboardingCompleted
        ? '/dashboard/investor'
        : '/onboarding/investor';

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      onboardingCompleted:
        user.role === 'INVESTOR' ? !!user.investorProfile?.onboardingCompleted : true,
      redirectUrl,
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
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
