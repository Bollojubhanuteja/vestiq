export interface MatchingWeights {
  industryWeight: number; // e.g. 0.25
  amountWeight: number;   // e.g. 0.20
  stageWeight: number;    // e.g. 0.15
  geoWeight: number;      // e.g. 0.10
  horizonWeight: number;  // e.g. 0.15
  riskWeight: number;     // e.g. 0.15
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  industryWeight: 0.25,
  amountWeight: 0.20,
  stageWeight: 0.15,
  geoWeight: 0.10,
  horizonWeight: 0.15,
  riskWeight: 0.15,
};

export interface InvestorPreferencesInput {
  minInvestment?: number;
  maxInvestment?: number;
  industries?: string[];
  geographies?: string[];
  horizons?: string[];
  riskTolerance?: 'LOWER' | 'MODERATE' | 'HIGHER' | string;
  stages?: string[];
  revenuePreference?: string;
  profitabilityPreference?: string;
}

export interface BusinessProfileForMatch {
  id: string;
  companyName: string;
  industry: string;
  country: string;
  city?: string;
  businessStage: string;
  fundingRequirement: number;
  revenueStatus?: string;
  profitabilityStatus?: string;
  // Risk assessment derived from stage and characteristics:
  derivedRisk?: 'LOWER' | 'MODERATE' | 'HIGHER' | string;
  // Typical horizon associated with stage:
  derivedHorizon?: string;
}

export interface FactorBreakdown {
  factor: string;
  weightPct: number;
  scorePct: number;
  pointsEarned: number;
  maxPoints: number;
  explanation: string;
  matched: boolean;
}

export interface MatchResult {
  score: number; // 0 - 100
  breakdown: FactorBreakdown[];
  summaryExplanation: string;
  legalDisclaimer: string;
}

export function calculatePreferenceMatch(
  preferences: InvestorPreferencesInput | null | undefined,
  business: BusinessProfileForMatch,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchResult {
  const disclaimer =
    "This preference match score reflects compatibility with your stated preferences only. It is NOT an assessment of business quality, financial viability, or investment return.";

  if (!preferences) {
    return {
      score: 50,
      breakdown: [],
      summaryExplanation: "Standard baseline score. Complete your investor preferences to see personalized compatibility.",
      legalDisclaimer: disclaimer,
    };
  }

  const breakdown: FactorBreakdown[] = [];

  // Normalize total weights
  const totalWeight =
    weights.industryWeight +
    weights.amountWeight +
    weights.stageWeight +
    weights.geoWeight +
    weights.horizonWeight +
    weights.riskWeight;

  const wInd = weights.industryWeight / totalWeight;
  const wAmt = weights.amountWeight / totalWeight;
  const wStg = weights.stageWeight / totalWeight;
  const wGeo = weights.geoWeight / totalWeight;
  const wHor = weights.horizonWeight / totalWeight;
  const wRsk = weights.riskWeight / totalWeight;

  // 1. Industry Match
  const userIndustries = preferences.industries || [];
  let industryScore = 0;
  let industryExplanation = "";
  let industryMatched = false;

  if (userIndustries.length === 0) {
    industryScore = 0.8; // Open to any
    industryExplanation = "You have not restricted industries (80% baseline compatibility).";
    industryMatched = true;
  } else if (userIndustries.some(i => i.toLowerCase().trim() === business.industry.toLowerCase().trim())) {
    industryScore = 1.0;
    industryExplanation = `Matches your selected industry: ${business.industry}.`;
    industryMatched = true;
  } else if (userIndustries.includes('Other')) {
    industryScore = 0.5;
    industryExplanation = `Industry ${business.industry} is outside your primary selections, but 'Other' is enabled.`;
    industryMatched = false;
  } else {
    industryScore = 0.1;
    industryExplanation = `${business.industry} is not in your stated preferred industries (${userIndustries.slice(0, 3).join(', ')}...).`;
    industryMatched = false;
  }

  breakdown.push({
    factor: "Industry Alignment",
    weightPct: Math.round(wInd * 100),
    scorePct: Math.round(industryScore * 100),
    pointsEarned: Math.round(industryScore * wInd * 100),
    maxPoints: Math.round(wInd * 100),
    explanation: industryExplanation,
    matched: industryMatched,
  });

  // 2. Investment Amount Compatibility
  const minInv = preferences.minInvestment ?? 50000;
  const maxInv = preferences.maxInvestment ?? 5000000;
  const fundingReq = business.fundingRequirement;
  let amtScore = 0;
  let amtExplanation = "";
  let amtMatched = false;

  // Check if funding requirement is within or compatible with investor's ticket size / total pool
  if (fundingReq >= minInv && fundingReq <= maxInv * 2) {
    amtScore = 1.0;
    amtExplanation = `Funding requirement (₹${fundingReq.toLocaleString('en-IN')}) aligns well with your investment range.`;
    amtMatched = true;
  } else if (fundingReq < minInv) {
    const diff = (minInv - fundingReq) / minInv;
    amtScore = Math.max(0.3, 1.0 - diff);
    amtExplanation = `Funding requirement is lower than your preferred minimum ticket size (₹${minInv.toLocaleString('en-IN')}).`;
    amtMatched = false;
  } else {
    const diff = (fundingReq - maxInv) / maxInv;
    amtScore = Math.max(0.2, 1.0 - Math.min(diff, 0.8));
    amtExplanation = `Funding requirement is higher than your maximum individual preference (₹${maxInv.toLocaleString('en-IN')}).`;
    amtMatched = false;
  }

  breakdown.push({
    factor: "Ticket Size & Funding Alignment",
    weightPct: Math.round(wAmt * 100),
    scorePct: Math.round(amtScore * 100),
    pointsEarned: Math.round(amtScore * wAmt * 100),
    maxPoints: Math.round(wAmt * 100),
    explanation: amtExplanation,
    matched: amtMatched,
  });

  // 3. Business Stage Preference
  const userStages = preferences.stages || [];
  let stageScore = 0;
  let stageExplanation = "";
  let stageMatched = false;

  if (userStages.length === 0) {
    stageScore = 0.8;
    stageExplanation = "No specific stage restriction set (80% baseline).";
    stageMatched = true;
  } else if (userStages.some(s => s.toLowerCase() === business.businessStage.toLowerCase())) {
    stageScore = 1.0;
    stageExplanation = `Matches your stage preference: ${business.businessStage}.`;
    stageMatched = true;
  } else {
    stageScore = 0.2;
    stageExplanation = `Stage (${business.businessStage}) is outside your current target stages.`;
    stageMatched = false;
  }

  breakdown.push({
    factor: "Business Stage",
    weightPct: Math.round(wStg * 100),
    scorePct: Math.round(stageScore * 100),
    pointsEarned: Math.round(stageScore * wStg * 100),
    maxPoints: Math.round(wStg * 100),
    explanation: stageExplanation,
    matched: stageMatched,
  });

  // 4. Geography Preference
  const userGeos = preferences.geographies || [];
  let geoScore = 0;
  let geoExplanation = "";
  let geoMatched = false;

  if (userGeos.length === 0) {
    geoScore = 0.9;
    geoExplanation = "Flexible across geographies.";
    geoMatched = true;
  } else if (userGeos.some(g => business.country.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(business.country.toLowerCase()))) {
    geoScore = 1.0;
    geoExplanation = `Matches your geographic preference: ${business.country}.`;
    geoMatched = true;
  } else {
    geoScore = 0.3;
    geoExplanation = `Location (${business.country}) is outside your target geographies.`;
    geoMatched = false;
  }

  breakdown.push({
    factor: "Geographic Location",
    weightPct: Math.round(wGeo * 100),
    scorePct: Math.round(geoScore * 100),
    pointsEarned: Math.round(geoScore * wGeo * 100),
    maxPoints: Math.round(wGeo * 100),
    explanation: geoExplanation,
    matched: geoMatched,
  });

  // 5. Investment Horizon
  const userHorizons = preferences.horizons || [];
  let horizonScore = 0.7; // default reasonable fit
  let horizonExplanation = "Opportunity timeline generally aligns with multi-year business buildout.";
  let horizonMatched = true;

  if (userHorizons.length > 0) {
    // Mature/Expansion matches shorter horizons; Pre-seed/Seed matches 3-5 or 5+
    const isEarly = ['pre-seed', 'seed', 'early stage'].includes(business.businessStage.toLowerCase());
    const wantsLong = userHorizons.some(h => h.includes('3–5') || h.includes('5+'));
    const wantsShort = userHorizons.some(h => h.includes('<1') || h.includes('1–3'));

    if (isEarly && wantsLong) {
      horizonScore = 1.0;
      horizonExplanation = "Early stage growth cycles correspond well with your 3+ year investment horizon.";
      horizonMatched = true;
    } else if (!isEarly && (wantsShort || wantsLong)) {
      horizonScore = 0.9;
      horizonExplanation = "Growth/expansion stage provides flexible liquidity horizons.";
      horizonMatched = true;
    } else if (isEarly && wantsShort) {
      horizonScore = 0.3;
      horizonExplanation = "Early stage startups rarely offer liquidity in under 3 years; conflicts with your stated short horizon.";
      horizonMatched = false;
    }
  }

  breakdown.push({
    factor: "Investment Horizon",
    weightPct: Math.round(wHor * 100),
    scorePct: Math.round(horizonScore * 100),
    pointsEarned: Math.round(horizonScore * wHor * 100),
    maxPoints: Math.round(wHor * 100),
    explanation: horizonExplanation,
    matched: horizonMatched,
  });

  // 6. Risk Preference
  const userRisk = preferences.riskTolerance || 'MODERATE';
  let riskScore = 0.7;
  let riskExplanation = "";
  let riskMatched = false;

  const isEarlyStage = ['pre-seed', 'seed'].includes(business.businessStage.toLowerCase());
  const isGrowthOrMature = ['growth', 'expansion', 'mature'].includes(business.businessStage.toLowerCase());

  if (userRisk === 'HIGHER') {
    riskScore = 1.0;
    riskExplanation = "Your stated risk tolerance accommodates high-uncertainty early stage or growth profiles.";
    riskMatched = true;
  } else if (userRisk === 'MODERATE') {
    if (isGrowthOrMature) {
      riskScore = 0.95;
      riskExplanation = "Growth/revenue profile fits moderate risk parameters.";
      riskMatched = true;
    } else {
      riskScore = 0.65;
      riskExplanation = "Early stage business entails higher operational risk than moderate preferences typically seek.";
      riskMatched = true;
    }
  } else {
    // LOWER
    if (business.profitabilityStatus === 'Profitable' || isGrowthOrMature) {
      riskScore = 0.85;
      riskExplanation = "Established traction or profitability lowers operational risk relative to early-stage ventures.";
      riskMatched = true;
    } else {
      riskScore = 0.25;
      riskExplanation = "Early stage venture carries higher risk than your stated conservative/lower risk preference.";
      riskMatched = false;
    }
  }

  breakdown.push({
    factor: "Risk Profile Alignment",
    weightPct: Math.round(wRsk * 100),
    scorePct: Math.round(riskScore * 100),
    pointsEarned: Math.round(riskScore * wRsk * 100),
    maxPoints: Math.round(wRsk * 100),
    explanation: riskExplanation,
    matched: riskMatched,
  });

  // Calculate final weighted score
  const rawSum = breakdown.reduce((sum, item) => sum + item.pointsEarned, 0);
  const totalMax = breakdown.reduce((sum, item) => sum + item.maxPoints, 0);
  const finalScore = Math.min(100, Math.max(10, Math.round((rawSum / totalMax) * 100)));

  return {
    score: finalScore,
    breakdown,
    summaryExplanation: `Your ${finalScore}% preference match is based strictly on your stated preferences for industry (${breakdown[0].scorePct}%), ticket size (${breakdown[1].scorePct}%), and stage (${breakdown[2].scorePct}%).`,
    legalDisclaimer: disclaimer,
  };
}
