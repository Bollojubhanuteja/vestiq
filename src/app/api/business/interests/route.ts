import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'BUSINESS') {
      return NextResponse.json({ error: 'Unauthorized. Business owner session required.' }, { status: 401 });
    }

    const business = await db.businessProfile.findUnique({
      where: { userId: session.userId },
      select: { id: true, companyName: true },
    });

    if (!business) {
      return NextResponse.json({ interests: [] });
    }

    const interests = await db.investmentInterest.findMany({
      where: { businessProfileId: business.id },
      include: {
        investorUser: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            country: true,
            investorProfile: {
              select: {
                experienceLevel: true,
                preferences: true,
              },
            },
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
    console.error('Error fetching business interests:', error);
    return NextResponse.json({ error: 'Failed to fetch investment interests' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'BUSINESS') {
      return NextResponse.json({ error: 'Unauthorized. Business owner session required.' }, { status: 401 });
    }

    const body = await req.json();
    const { interestId, status, note } = body;

    if (!interestId || !status) {
      return NextResponse.json({ error: 'interestId and status are required' }, { status: 400 });
    }

    // Verify interest belongs to business
    const interest = await db.investmentInterest.findUnique({
      where: { id: interestId },
      include: {
        businessProfile: true,
        investorUser: true,
      },
    });

    if (!interest || interest.businessProfile.userId !== session.userId) {
      return NextResponse.json({ error: 'Interest record not found or access denied.' }, { status: 404 });
    }

    const validStatuses = [
      'INTEREST_SUBMITTED',
      'BUSINESS_REVIEWING',
      'DISCUSSION',
      'DUE_DILIGENCE',
      'AGREEMENT',
      'COMPLETED',
      'DECLINED',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const updatedInterest = await db.investmentInterest.update({
      where: { id: interestId },
      data: {
        status,
        ...(note ? { notes: note } : {}),
      },
    });

    // Notify investor of status advance
    try {
      const statusLabels: Record<string, string> = {
        BUSINESS_REVIEWING: 'Under Founder Review',
        DISCUSSION: 'In Direct Discussion',
        DUE_DILIGENCE: 'In Due Diligence',
        AGREEMENT: 'Indicative Agreement Ready',
        COMPLETED: 'Investment Closed',
        DECLINED: 'Declined',
      };

      await db.notification.create({
        data: {
          userId: interest.investorUserId,
          title: `Status Update: ${interest.businessProfile.companyName}`,
          message: `${interest.businessProfile.companyName} updated your expression of interest status to "${statusLabels[status] || status}".`,
          type: 'INTEREST',
          link: '/dashboard/investor/requests',
        },
      });
    } catch (notifErr) {
      console.warn('Could not dispatch notification:', notifErr);
    }

    return NextResponse.json({ success: true, interest: updatedInterest });
  } catch (error: any) {
    console.error('Error updating business interest:', error);
    return NextResponse.json({ error: 'Failed to update investment interest' }, { status: 500 });
  }
}
