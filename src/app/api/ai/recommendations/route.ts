import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { scorePageCandidate, DEFAULT_WEIGHTS, ScoringWeights } from '@/lib/ai-matching';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { finalEditId, customWeights } = await req.json();

    if (!finalEditId) {
      return NextResponse.json({ error: 'finalEditId is required' }, { status: 400 });
    }

    const finalEdit = await db.finalEdit.findUnique({
      where: { id: finalEditId },
      include: {
        campaign: true,
        assignment: {
          include: { socialPage: true },
        },
      },
    });

    if (!finalEdit) {
      return NextResponse.json({ error: 'Final edit not found' }, { status: 404 });
    }

    // Check if this edit is already locked to a page
    const isAlreadyAssigned = Boolean(finalEdit.assignment);

    // Fetch all active social pages
    const pages = await db.socialPage.findMany({
      include: {
        partner: true,
        assignments: {
          where: { campaignId: finalEdit.campaignId },
        },
      },
    });

    const targetPlatforms = finalEdit.campaign.targetPlatforms.split(',');
    const placementBudgetLimitCents = Math.round(
      finalEdit.campaign.placementBudgetCents / (finalEdit.campaign.desiredEditsCount || 1)
    );

    const weights: ScoringWeights = customWeights ? { ...DEFAULT_WEIGHTS, ...customWeights } : DEFAULT_WEIGHTS;

    const rankedCandidates = pages.map((page) => {
      const scoring = scorePageCandidate(
        {
          id: page.id,
          niche: page.niche,
          platform: page.platform,
          medianViews: page.medianViews,
          postingFrequency: page.postingFrequency,
          placementPriceCents: page.placementPriceCents,
          verificationLevel: page.verificationLevel,
          completionRate: page.completionRate,
          audienceMarkets: page.audienceMarkets,
          status: page.status,
          metricProvenance: page.metricProvenance,
          hasActiveAssignment: page.assignments.length > 0,
        },
        {
          targetNiche: finalEdit.campaign.contentNiche,
          targetPlatforms,
          placementBudgetLimitCents,
          targetAudience: finalEdit.campaign.targetAudience,
        },
        weights
      );

      return {
        page: {
          id: page.id,
          platform: page.platform,
          handle: page.handle,
          pageName: page.pageName,
          profileUrl: page.profileUrl,
          niche: page.niche,
          primaryLanguage: page.primaryLanguage,
          audienceMarkets: page.audienceMarkets,
          placementPriceCents: page.placementPriceCents,
          verificationLevel: page.verificationLevel,
          medianViews: page.medianViews,
          medianViewsSample: page.medianViewsSample,
          postingFrequency: page.postingFrequency,
          engagementRate: page.engagementRate,
          completionRate: page.completionRate,
          metricProvenance: page.metricProvenance,
          metricLastSync: page.metricLastSync,
          partnerBusinessName: page.partner.businessName,
          partnerRating: page.partner.rating,
        },
        ...scoring,
      };
    });

    // Sort by compositeScore descending, eligible first
    rankedCandidates.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.compositeScore - a.compositeScore;
    });

    return NextResponse.json({
      finalEditId: finalEdit.id,
      campaignTitle: finalEdit.campaign.title,
      isAlreadyAssigned,
      assignedPage: finalEdit.assignment?.socialPage || null,
      assignmentStatus: finalEdit.assignment?.status || null,
      scoringWeights: weights,
      candidates: rankedCandidates,
    });
  } catch (error: any) {
    console.error('AI Matching error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
