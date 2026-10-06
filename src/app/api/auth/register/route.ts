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
  companyName: z.string().optional(),
  industry: z.string().optional(),
  fundingRequirement: z.number().optional(),
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

    const { name, email, password, role, phone, country, city, companyName, industry, fundingRequirement } = parsed.data;
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

    // If investor, create initial profile shell and preference record
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

    // If business/startup, initialize their BusinessProfile
    if (role === 'BUSINESS') {
      const resolvedCompany = companyName?.trim() || `${name}'s Venture`;
      const resolvedCity = city?.trim() || 'India';
      const resolvedIndustry = industry || 'Technology';

      await db.businessProfile.create({
        data: {
          userId: user.id,
          companyName: resolvedCompany,
          founderName: name,
          email: normalizedEmail,
          phone: phone || null,
          country: country || 'India',
          city: resolvedCity,
          industry: resolvedIndustry,
          businessStage: 'Seed',
          yearsOperating: 1,
          teamSize: 2,
          businessDescription: `${resolvedCompany} is an Indian growth venture seeking strategic capital and active investor partnerships on Vestiq.`,
          problem: 'Market demand requires dedicated growth funding and structured expansion capital.',
          solution: 'Proprietary product/service offering backed by committed promoter execution.',
          businessModel: 'B2B & Commercial Operations',
          revenueStatus: 'Pre-revenue',
          profitabilityStatus: 'Early Stage',
          fundingRequirement: fundingRequirement || 2500000,
          intendedUseOfFunds: 'Product development, team expansion, operational infrastructure, and working capital.',
          investmentModel: 'EQUITY',
          minimumInvestment: 200000,
          valuation: 20000000,
          equityOffered: 12.5,
          preMoneyValuation: 17500000,
          postMoneyValuation: 20000000,
          status: 'DRAFT',
          verificationStatus: 'NOT_REVIEWED',
          isPublished: false,
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

    await trackEvent('REGISTRATION', user.id, null, { role: user.role, company: companyName || null });

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      requiresOnboarding: role === 'INVESTOR',
      redirectUrl: role === 'INVESTOR' ? '/onboarding/investor' : '/dashboard/business',
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
