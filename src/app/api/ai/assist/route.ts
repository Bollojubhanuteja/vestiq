import { NextRequest, NextResponse } from 'next/server';
import { getTermExplanation, getAllTerms, AI_DISCLAIMER_LABEL } from '@/lib/ai';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');

  if (term) {
    const explanation = getTermExplanation(term);
    return NextResponse.json({
      explanation,
      disclaimer: AI_DISCLAIMER_LABEL,
    });
  }

  return NextResponse.json({
    terms: getAllTerms(),
    disclaimer: AI_DISCLAIMER_LABEL,
  });
}
