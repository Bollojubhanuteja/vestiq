import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'BUSINESS') {
      return NextResponse.json({ error: 'Unauthorized: Business access required' }, { status: 401 });
    }

    const business = await db.businessProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!business) {
      return NextResponse.json({ error: 'Please create your business profile before submitting.' }, { status: 400 });
    }

    // Validation for submission completeness
    if (!business.companyName || !business.problem || !business.solution || !business.fundingRequirement) {
      return NextResponse.json(
        { error: 'Please fill in Company Name, Problem, Solution, and Funding Requirement before submitting for review.' },
        { status: 400 }
      );
    }

    // Transition state to SUBMITTED / UNDER_REVIEW. Keep isPublished: false until admin approves.
    const updated = await db.businessProfile.update({
      where: { userId: session.userId },
      data: {
        status: 'SUBMITTED',
        verificationStatus: 'UNDER_REVIEW',
        isPublished: false,
      },
    });

    await trackEvent('BUSINESS_SUBMISSION', session.userId, updated.id, {
      companyName: updated.companyName,
    });

    return NextResponse.json({
      success: true,
      message: 'Opportunity submitted for review. An administrator will inspect your submission.',
      business: updated,
    });
  } catch (error) {
    console.error('Error submitting opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
