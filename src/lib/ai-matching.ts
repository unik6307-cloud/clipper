export interface ScoringWeights {
  nicheRelevance: number; // default 25
  medianViews: number;    // default 20
  audienceFit: number;    // default 15
  budgetFit: number;      // default 15
  recentActivity: number; // default 10
  deliveryHistory: number;// default 10
  verification: number;   // default 5
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  nicheRelevance: 25,
  medianViews: 20,
  audienceFit: 15,
  budgetFit: 15,
  recentActivity: 10,
  deliveryHistory: 10,
  verification: 5,
};

export interface PageRecommendationResult {
  socialPageId: string;
  compositeScore: number;
  breakdown: {
    nicheScore: number;
    viewsScore: number;
    audienceScore: number;
    priceScore: number;
    activityScore: number;
    deliveryScore: number;
    verificationScore: number;
  };
  explanation: string;
  missingDataCaveats: string[];
  exclusionReason?: string;
  isEligible: boolean;
}

export function scorePageCandidate(
  page: {
    id: string;
    niche: string;
    platform: string;
    medianViews: number;
    postingFrequency: number;
    placementPriceCents: number;
    verificationLevel: string;
    completionRate: number;
    audienceMarkets: string;
    status: string;
    metricProvenance: string;
    hasActiveAssignment?: boolean;
  },
  criteria: {
    targetNiche: string;
    targetPlatforms: string[];
    placementBudgetLimitCents: number;
    targetAudience: string;
  },
  weights: ScoringWeights = DEFAULT_WEIGHTS
): PageRecommendationResult {
  const caveats: string[] = [];
  let isEligible = true;
  let exclusionReason: string | undefined = undefined;

  // Hard filter: Platform match
  if (!criteria.targetPlatforms.includes(page.platform)) {
    isEligible = false;
    exclusionReason = `Platform (${page.platform}) not requested in campaign brief`;
  }

  // Hard filter: Inactive status
  if (page.status !== 'ACTIVE') {
    isEligible = false;
    exclusionReason = `Page status is ${page.status}`;
  }

  // 1. Niche & Content Relevance (Max: weights.nicheRelevance)
  let nicheScore = 0;
  const pageNicheLower = page.niche.toLowerCase();
  const targetNicheLower = criteria.targetNiche.toLowerCase();
  if (pageNicheLower === targetNicheLower) {
    nicheScore = weights.nicheRelevance;
  } else if (pageNicheLower.includes(targetNicheLower) || targetNicheLower.includes(pageNicheLower)) {
    nicheScore = weights.nicheRelevance * 0.85;
  } else {
    nicheScore = weights.nicheRelevance * 0.35;
    caveats.push('Niche partially differs from exact campaign target.');
  }

  // 2. Median Views & Consistency (Max: weights.medianViews)
  let viewsScore = 0;
  if (page.medianViews <= 0) {
    viewsScore = 0;
    caveats.push('No verifiable view history available.');
  } else if (page.medianViews >= 30000) {
    viewsScore = weights.medianViews;
  } else if (page.medianViews >= 15000) {
    viewsScore = weights.medianViews * 0.8;
  } else if (page.medianViews >= 5000) {
    viewsScore = weights.medianViews * 0.55;
  } else {
    viewsScore = weights.medianViews * 0.3;
  }

  // 3. Audience Compatibility (Max: weights.audienceFit)
  let audienceScore = 0;
  if (page.audienceMarkets.toLowerCase().includes('united states') || page.audienceMarkets.toLowerCase().includes('us')) {
    audienceScore = weights.audienceFit * 0.95;
  } else {
    audienceScore = weights.audienceFit * 0.6;
    caveats.push('Audience distribution is global/unsegmented.');
  }

  // 4. Budget & Price Fit (Max: weights.budgetFit)
  let priceScore = 0;
  if (page.placementPriceCents <= criteria.placementBudgetLimitCents) {
    // Under or equal to budget
    const ratio = page.placementPriceCents / criteria.placementBudgetLimitCents;
    priceScore = weights.budgetFit * (0.8 + 0.2 * (1 - ratio));
  } else {
    // Exceeds budget
    const overage = (page.placementPriceCents - criteria.placementBudgetLimitCents) / criteria.placementBudgetLimitCents;
    if (overage > 0.5) {
      priceScore = 0;
      caveats.push(`Placement price ($${(page.placementPriceCents / 100).toFixed(2)}) significantly exceeds per-edit budget ($${(criteria.placementBudgetLimitCents / 100).toFixed(2)}).`);
    } else {
      priceScore = weights.budgetFit * Math.max(0, 1 - overage * 2);
      caveats.push(`Placement price is slightly above standard budget.`);
    }
  }

  // 5. Recent Activity & Posting Frequency (Max: weights.recentActivity)
  let activityScore = 0;
  if (page.postingFrequency >= 4.0 && page.postingFrequency <= 10.0) {
    activityScore = weights.recentActivity;
  } else if (page.postingFrequency >= 2.0) {
    activityScore = weights.recentActivity * 0.75;
  } else {
    activityScore = weights.recentActivity * 0.3;
    caveats.push('Low posting cadence may affect algorithmic distribution.');
  }

  // 6. Historical Delivery Reliability (Max: weights.deliveryHistory)
  let deliveryScore = 0;
  if (page.completionRate >= 98.0) {
    deliveryScore = weights.deliveryHistory;
  } else if (page.completionRate >= 90.0) {
    deliveryScore = weights.deliveryHistory * 0.8;
  } else {
    deliveryScore = weights.deliveryHistory * 0.4;
    caveats.push('Page has recorded previous delayed or unfulfilled commitments.');
  }

  // 7. Verification Completeness (Max: weights.verification)
  let verificationScore = 0;
  if (page.verificationLevel === 'API_VERIFIED') {
    verificationScore = weights.verification;
  } else if (page.verificationLevel === 'MANUAL_VERIFIED') {
    verificationScore = weights.verification * 0.65;
    caveats.push('Verified via reviewer audit, not live OAuth API.');
  } else {
    verificationScore = 0;
    caveats.push('Page is UNVERIFIED; recommended with caution.');
    if (page.verificationLevel === 'UNVERIFIED') {
      isEligible = false;
      exclusionReason = 'Excluded from high-trust candidate pool until ownership is verified.';
    }
  }

  // Check existing assignment conflict
  if (page.hasActiveAssignment) {
    caveats.push('Note: Page currently holds an assignment for another edit in this campaign.');
  }

  const rawSum =
    nicheScore +
    viewsScore +
    audienceScore +
    priceScore +
    activityScore +
    deliveryScore +
    verificationScore;

  const totalMax = Object.values(weights).reduce((a, b) => a + b, 0);
  const compositeScore = Math.round((rawSum / totalMax) * 1000) / 10;

  // Generate clear explanation
  let explanation = '';
  if (compositeScore >= 85) {
    explanation = `Tier 1 Prime Candidate (${compositeScore}% fit): Outstanding alignment in ${page.niche}, strong verified engagement (${page.medianViews.toLocaleString()} median views), and 99%+ reliability.`;
  } else if (compositeScore >= 70) {
    explanation = `Tier 2 Viable Option (${compositeScore}% fit): Good topical fit with solid delivery track record, offering competitive value at $${(page.placementPriceCents / 100).toFixed(2)}.`;
  } else {
    explanation = `Tier 3 Sub-optimal (${compositeScore}% fit): Lower performance indicators or verification gaps. Review caveats carefully before assigning.`;
  }

  return {
    socialPageId: page.id,
    compositeScore: isEligible ? compositeScore : Math.min(compositeScore, 40),
    breakdown: {
      nicheScore: Math.round(nicheScore * 10) / 10,
      viewsScore: Math.round(viewsScore * 10) / 10,
      audienceScore: Math.round(audienceScore * 10) / 10,
      priceScore: Math.round(priceScore * 10) / 10,
      activityScore: Math.round(activityScore * 10) / 10,
      deliveryScore: Math.round(deliveryScore * 10) / 10,
      verificationScore: Math.round(verificationScore * 10) / 10,
    },
    explanation,
    missingDataCaveats: caveats,
    exclusionReason,
    isEligible,
  };
}
