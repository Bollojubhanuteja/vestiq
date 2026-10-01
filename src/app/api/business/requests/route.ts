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
    });

    if (!business) {
      return NextResponse.json({ requests: [] });
    }

    const requests = await db.informationRequest.findMany({
      where: { businessProfileId: business.id },
      include: {
        investorUser: {
          select: {
            name: true,
            email: true,
            country: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching business requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { requestId, businessReply } = body;

    if (!requestId || !businessReply?.trim()) {
      return NextResponse.json({ error: 'requestId and businessReply are required' }, { status: 400 });
    }

    // Verify ownership of the request
    const existingReq = await db.informationRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingReq || existingReq.businessProfileId !== business.id) {
      return NextResponse.json({ error: 'Forbidden: Request does not belong to your business' }, { status: 403 });
    }

    const updated = await db.informationRequest.update({
      where: { id: requestId },
      data: {
        businessReply: businessReply.trim(),
        status: 'RESPONDED',
        repliedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error('Error replying to request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
