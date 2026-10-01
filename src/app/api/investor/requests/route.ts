import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const requests = await db.informationRequest.findMany({
      where: { investorUserId: session.userId },
      include: {
        businessProfile: {
          select: {
            id: true,
            companyName: true,
            founderName: true,
            industry: true,
            fundingRequirement: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching investor requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
