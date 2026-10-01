import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        city: true,
        phone: true,
        investorProfile: {
          select: {
            id: true,
            experienceLevel: true,
            onboardingCompleted: true,
            preferences: true,
          },
        },
        businessProfile: {
          select: {
            id: true,
            companyName: true,
            status: true,
            verificationStatus: true,
            isPublished: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        city: user.city,
        phone: user.phone,
        investorProfile: user.investorProfile,
        businessProfile: user.businessProfile,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
