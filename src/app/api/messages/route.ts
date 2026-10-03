import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const interestId = searchParams.get('interestId');

    if (!interestId) {
      return NextResponse.json({ error: 'interestId query parameter is required' }, { status: 400 });
    }

    const interest = await db.investmentInterest.findUnique({
      where: { id: interestId },
      include: { businessProfile: true },
    });

    if (!interest) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    const isInvestor = interest.investorUserId === session.userId;
    const isOwner = interest.businessProfile.userId === session.userId;
    if (!isInvestor && !isOwner && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to view messages for this interest' }, { status: 403 });
    }

    const messages = await db.investmentMessage.findMany({
      where: { interestId },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { interestId, content } = body;

    if (!interestId || !content?.trim()) {
      return NextResponse.json({ error: 'interestId and content are required' }, { status: 400 });
    }

    const interest = await db.investmentInterest.findUnique({
      where: { id: interestId },
      include: { businessProfile: true },
    });

    if (!interest) {
      return NextResponse.json({ error: 'Interest record not found' }, { status: 404 });
    }

    const isInvestor = interest.investorUserId === session.userId;
    const isOwner = interest.businessProfile.userId === session.userId;
    if (!isInvestor && !isOwner && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const recipientId = isInvestor ? interest.businessProfile.userId : interest.investorUserId;

    const message = await db.investmentMessage.create({
      data: {
        interestId,
        senderId: session.userId,
        recipientId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    // Advance status to DISCUSSION if it was INTEREST_SUBMITTED or BUSINESS_REVIEWING
    if (interest.status === 'INTEREST_SUBMITTED' || interest.status === 'BUSINESS_REVIEWING') {
      await db.investmentInterest.update({
        where: { id: interestId },
        data: { status: 'DISCUSSION' },
      });
    }

    // Send notification to recipient
    try {
      await db.notification.create({
        data: {
          userId: recipientId,
          title: `New Message regarding ${interest.businessProfile.companyName}`,
          message: `${session.name}: "${content.slice(0, 80)}${content.length > 80 ? '...' : ''}"`,
          type: 'INTEREST',
          link: isInvestor ? '/dashboard/business/requests' : '/dashboard/investor/requests',
        },
      });
    } catch {}

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
