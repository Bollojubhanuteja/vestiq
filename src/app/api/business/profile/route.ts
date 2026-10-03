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
      // Investment Model & Structure Fields
      investmentModel: body.investmentModel || 'EQUITY',
      minimumInvestment: body.minimumInvestment !== undefined ? parseFloat(body.minimumInvestment) : 200000,
      proposedReturnRate: body.proposedReturnRate !== undefined && body.proposedReturnRate !== null && body.proposedReturnRate !== '' ? parseFloat(body.proposedReturnRate) : null,
      investmentTenureMonths: body.investmentTenureMonths !== undefined && body.investmentTenureMonths !== null && body.investmentTenureMonths !== '' ? parseInt(body.investmentTenureMonths) : null,
      expectedRepaymentAmount: body.expectedRepaymentAmount !== undefined && body.expectedRepaymentAmount !== null && body.expectedRepaymentAmount !== '' ? parseFloat(body.expectedRepaymentAmount) : null,
      repaymentFrequency: body.repaymentFrequency || (body.investmentModel === 'FIXED_RETURN' ? 'MONTHLY' : null),
      collateralDetails: body.collateralDetails || null,
      valuation: body.valuation !== undefined && body.valuation !== null && body.valuation !== '' ? parseFloat(body.valuation) : null,
      equityOffered: body.equityOffered !== undefined && body.equityOffered !== null && body.equityOffered !== '' ? parseFloat(body.equityOffered) : null,
      preMoneyValuation: body.preMoneyValuation !== undefined && body.preMoneyValuation !== null && body.preMoneyValuation !== '' ? parseFloat(body.preMoneyValuation) : null,
      postMoneyValuation: body.postMoneyValuation !== undefined && body.postMoneyValuation !== null && body.postMoneyValuation !== '' ? parseFloat(body.postMoneyValuation) : null,
      investorOwnershipPercentage: body.investorOwnershipPercentage !== undefined && body.investorOwnershipPercentage !== null && body.investorOwnershipPercentage !== '' ? parseFloat(body.investorOwnershipPercentage) : null,
      investorRights: body.investorRights || null,
      growthMetrics: body.growthMetrics || null,
      riskLevel: body.riskLevel || 'MODERATE',
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
