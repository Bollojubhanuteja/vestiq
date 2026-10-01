import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'BUSINESS') {
      return NextResponse.json({ error: 'Unauthorized: Business access required' }, { status: 401 });
    }

    const business = await db.businessProfile.findUnique({
      where: { userId: session.userId },
      include: {
        documents: true,
        riskFlags: true,
      },
    });

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'BUSINESS') {
      return NextResponse.json({ error: 'Unauthorized: Business access required' }, { status: 401 });
    }

    const body = await req.json();

    const existing = await db.businessProfile.findUnique({
      where: { userId: session.userId },
    });

    const data = {
      companyName: body.companyName || 'My Startup',
      founderName: body.founderName || session.name,
      email: body.email || session.email,
      phone: body.phone || null,
      website: body.website || null,
      country: body.country || 'India',
      city: body.city || '',
      industry: body.industry || 'Technology',
      businessStage: body.businessStage || 'Seed',
      yearsOperating: parseFloat(body.yearsOperating) || 1,
      teamSize: parseInt(body.teamSize) || 1,
      businessDescription: body.businessDescription || '',
      problem: body.problem || '',
      solution: body.solution || '',
      businessModel: body.businessModel || '',
      customerTraction: body.customerTraction || '',
      revenueStatus: body.revenueStatus || 'Pre-revenue',
      revenueDetails: body.revenueDetails || null,
      profitabilityStatus: body.profitabilityStatus || 'Early Stage',
      fundingRequirement: parseFloat(body.fundingRequirement) || 1000000,
      intendedUseOfFunds: body.intendedUseOfFunds || '',
      previousFunding: body.previousFunding || '',
    };

    let profile;
    if (existing) {
      profile = await db.businessProfile.update({
        where: { userId: session.userId },
        data,
      });
    } else {
      profile = await db.businessProfile.create({
        data: {
          ...data,
          userId: session.userId,
          status: 'DRAFT',
          verificationStatus: 'NOT_REVIEWED',
          isPublished: false,
        },
      });
    }

    return NextResponse.json({ success: true, business: profile });
  } catch (error) {
    console.error('Error saving business profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
