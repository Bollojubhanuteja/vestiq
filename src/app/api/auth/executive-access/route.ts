import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Unauthenticated executive quick-access is disabled for security. All administrative access requires verified credentials via the administrative login portal.',
    },
    { status: 403 }
  );
}
