import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const profile = await db.investorProfile.findUnique({
      where: { userId: session.userId },
      include: { preferences: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const preferences = profile.preferences
      ? {
          minInvestment: profile.preferences.minInvestment,
          maxInvestment: profile.preferences.maxInvestment,
          industries: JSON.parse(profile.preferences.industries || '[]'),
          geographies: JSON.parse(profile.preferences.geographies || '[]'),
          horizons: JSON.parse(profile.preferences.horizons || '[]'),
          riskTolerance: profile.preferences.riskTolerance,
          stages: JSON.parse(profile.preferences.stages || '[]'),
          revenuePreference: profile.preferences.revenuePreference,
          profitabilityPreference: profile.preferences.profitabilityPreference,
        }
      : null;

    return NextResponse.json({ preferences, experienceLevel: profile.experienceLevel, bio: profile.bio });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const body = await req.json();

    const profile = await db.investorProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updated = await db.investorPreference.upsert({
      where: { investorProfileId: profile.id },
      update: {
        minInvestment: body.minInvestment ?? 100000,
        maxInvestment: body.maxInvestment ?? 5000000,
        industries: JSON.stringify(body.industries || []),
        geographies: JSON.stringify(body.geographies || ['India']),
        horizons: JSON.stringify(body.horizons || []),
        riskTolerance: body.riskTolerance || 'MODERATE',
        stages: JSON.stringify(body.stages || []),
        revenuePreference: body.revenuePreference || 'ANY',
        profitabilityPreference: body.profitabilityPreference || 'ANY',
      },
      create: {
        investorProfileId: profile.id,
        minInvestment: body.minInvestment ?? 100000,
        maxInvestment: body.maxInvestment ?? 5000000,
        industries: JSON.stringify(body.industries || []),
        geographies: JSON.stringify(body.geographies || ['India']),
        horizons: JSON.stringify(body.horizons || []),
        riskTolerance: body.riskTolerance || 'MODERATE',
        stages: JSON.stringify(body.stages || []),
        revenuePreference: body.revenuePreference || 'ANY',
        profitabilityPreference: body.profitabilityPreference || 'ANY',
      },
    });

    return NextResponse.json({ success: true, preferences: updated });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
