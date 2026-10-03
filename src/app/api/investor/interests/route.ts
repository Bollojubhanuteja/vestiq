import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized. Investor session required.' }, { status: 401 });
    }

    const interests = await db.investmentInterest.findMany({
      where: { investorUserId: session.userId },
      include: {
        businessProfile: {
          select: {
            id: true,
            companyName: true,
            founderName: true,
            industry: true,
            city: true,
            country: true,
            businessStage: true,
            fundingRequirement: true,
            investmentModel: true,
            proposedReturnRate: true,
            investmentTenureMonths: true,
            expectedRepaymentAmount: true,
            repaymentFrequency: true,
            valuation: true,
            equityOffered: true,
            verificationStatus: true,
            status: true,
          },
        },
        agreements: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ interests });
  } catch (error: any) {
    console.error('Error fetching investor interests:', error);
    return NextResponse.json({ error: 'Failed to fetch investment interests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized. Please log in as an investor to express interest.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessProfileId,
      intendedAmount,
      investmentModel,
      ownershipOrReturnProposed,
      notes,
      termsAccepted,
    } = body;

    if (!businessProfileId || !intendedAmount || intendedAmount <= 0) {
      return NextResponse.json({ error: 'Valid business ID and intended investment amount are required.' }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: 'You must review and accept the indicative terms and risk disclosure.' }, { status: 400 });
    }

    // Verify business exists and is approved
    const business = await db.businessProfile.findUnique({
      where: { id: businessProfileId },
      include: { user: true },
    });

    if (!business || business.status !== 'APPROVED') {
      return NextResponse.json({ error: 'This business opportunity is not currently accepting investor interest.' }, { status: 404 });
    }

    // Check minimum investment
    if (business.minimumInvestment && intendedAmount < business.minimumInvestment) {
      return NextResponse.json({
        error: `Minimum intended investment for this opportunity is ₹${business.minimumInvestment.toLocaleString('en-IN')}.`,
      }, { status: 400 });
    }

    // Create Interest Record
    const interest = await db.investmentInterest.create({
      data: {
        investorUserId: session.userId,
        businessProfileId: business.id,
        investmentModel: investmentModel || business.investmentModel || 'EQUITY',
        intendedAmount: Number(intendedAmount),
        ownershipOrReturnProposed: ownershipOrReturnProposed || (business.investmentModel === 'FIXED_RETURN' ? `${business.proposedReturnRate}% p.a. Fixed Return` : `${business.equityOffered}% Equity Partnership`),
        notes: notes || null,
        status: 'INTEREST_SUBMITTED',
        termsAccepted: true,
      },
    });

    // Notify business owner
    await db.notification.create({
      data: {
        userId: business.userId,
        title: 'New Investor Interest Received',
        message: `${session.name || 'An investor'} expressed interest in your ${business.investmentModel === 'FIXED_RETURN' ? 'Fixed Return Note' : 'Equity Opportunity'} for ₹${Number(intendedAmount).toLocaleString('en-IN')}.`,
        type: 'INTEREST',
        link: '/dashboard/business/interests',
      },
    });

    // Log analytics
    await db.analyticsEvent.create({
      data: {
        eventType: 'EXPRESS_INTEREST',
        userId: session.userId,
        entityId: business.id,
        metadata: JSON.stringify({
          amount: intendedAmount,
          model: business.investmentModel,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      interest,
      message: 'Your expression of interest has been submitted. The business owner has been notified.',
    });
  } catch (error: any) {
    console.error('Error submitting investment interest:', error);
    return NextResponse.json({ error: 'Failed to submit expression of interest' }, { status: 500 });
  }
}
