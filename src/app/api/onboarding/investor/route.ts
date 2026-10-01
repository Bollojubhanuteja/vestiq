import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const onboardingSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  country: z.string(),
  city: z.string().optional(),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERIENCED']),
  minInvestment: z.number().min(10000),
  maxInvestment: z.number().min(10000),
  industries: z.array(z.string()).min(1, 'Select at least one industry'),
  geographies: z.array(z.string()).default(['India']),
  horizons: z.array(z.string()).min(1, 'Select at least one investment horizon'),
  riskTolerance: z.enum(['LOWER', 'MODERATE', 'HIGHER']),
  stages: z.array(z.string()).min(1, 'Select at least one stage'),
  revenuePreference: z.string().default('ANY'),
  profitabilityPreference: z.string().default('ANY'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid onboarding data' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Update user contact details
    await db.user.update({
      where: { id: session.userId },
      data: {
        name: data.fullName,
        phone: data.phone || null,
        country: data.country,
        city: data.city || null,
      },
    });

    // Update or create investor profile
    const profile = await db.investorProfile.upsert({
      where: { userId: session.userId },
      update: {
        experienceLevel: data.experienceLevel,
        onboardingCompleted: true,
      },
      create: {
        userId: session.userId,
        experienceLevel: data.experienceLevel,
        onboardingCompleted: true,
      },
    });

    // Update or create preferences
    await db.investorPreference.upsert({
      where: { investorProfileId: profile.id },
      update: {
        minInvestment: data.minInvestment,
        maxInvestment: data.maxInvestment,
        industries: JSON.stringify(data.industries),
        geographies: JSON.stringify(data.geographies),
        horizons: JSON.stringify(data.horizons),
        riskTolerance: data.riskTolerance,
        stages: JSON.stringify(data.stages),
        revenuePreference: data.revenuePreference,
        profitabilityPreference: data.profitabilityPreference,
      },
      create: {
        investorProfileId: profile.id,
        minInvestment: data.minInvestment,
        maxInvestment: data.maxInvestment,
        industries: JSON.stringify(data.industries),
        geographies: JSON.stringify(data.geographies),
        horizons: JSON.stringify(data.horizons),
        riskTolerance: data.riskTolerance,
        stages: JSON.stringify(data.stages),
        revenuePreference: data.revenuePreference,
        profitabilityPreference: data.profitabilityPreference,
      },
    });

    await trackEvent('ONBOARDING_COMPLETE', session.userId, null, {
      experienceLevel: data.experienceLevel,
    });

    return NextResponse.json({
      success: true,
      message: 'Investor onboarding completed successfully.',
    });
  } catch (error) {
    console.error('Investor onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
