import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, SESSION_COOKIE_OPTIONS } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['INVESTOR', 'BUSINESS'] as const),
  phone: z.string().optional(),
  country: z.string().default('India'),
  city: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { name, email, password, role, phone, country, city } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role,
        phone: phone || null,
        country: country || 'India',
        city: city || null,
      },
    });

    // If investor, create initial profile shell
    if (role === 'INVESTOR') {
      const invProfile = await db.investorProfile.create({
        data: {
          userId: user.id,
          experienceLevel: 'BEGINNER',
          onboardingCompleted: false,
        },
      });

      await db.investorPreference.create({
        data: {
          investorProfileId: invProfile.id,
          minInvestment: 100000,
          maxInvestment: 2500000,
          industries: JSON.stringify([]),
          geographies: JSON.stringify([country || 'India']),
          horizons: JSON.stringify(['1–3 years', '3–5 years']),
          riskTolerance: 'MODERATE',
          stages: JSON.stringify([]),
        },
      });
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'INVESTOR' | 'BUSINESS' | 'ADMIN',
      name: user.name,
    };

    const token = await signToken(sessionPayload);

    await trackEvent('REGISTRATION', user.id, null, { role: user.role });

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      requiresOnboarding: role === 'INVESTOR',
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
