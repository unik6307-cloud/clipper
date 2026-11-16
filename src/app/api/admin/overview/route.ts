import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['OPERATIONS_ADMIN', 'FINANCE_MANAGER', 'SUPER_ADMIN']);

    const [
      creatorsCount,
      partnersCount,
      pagesCount,
      verifiedPagesCount,
      campaignsCount,
      finalEditsCount,
      assignmentsCount,
      verifiedPostsCount,
      disputesCount,
      quotes,
      payouts,
      ledgerEntries,
    ] = await Promise.all([
      db.user.count({ where: { role: 'CONTENT_CREATOR' } }),
      db.user.count({ where: { role: 'DISTRIBUTION_PARTNER' } }),
      db.socialPage.count(),
      db.socialPage.count({ where: { verificationLevel: { in: ['API_VERIFIED', 'MANUAL_VERIFIED'] } } }),
      db.campaign.count(),
      db.finalEdit.count(),
      db.distributionAssignment.count(),
      db.publishedPost.count({ where: { verificationStatus: { in: ['API_VERIFIED', 'MANUAL_REVIEW_APPROVED'] } } }),
      db.dispute.count(),
      db.quote.findMany({ where: { status: 'ACCEPTED' } }),
      db.partnerPayout.findMany(),
      db.ledgerEntry.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

    // Financial math
    const totalGmvCents = quotes.reduce((acc, q) => acc + q.totalDueCents, 0);
    const editingRevenueCents = quotes.reduce((acc, q) => acc + q.editingSubtotalCents, 0);
    const placementRevenueCents = quotes.reduce((acc, q) => acc + q.placementSubtotalCents, 0);
    const platformFeesEarnedCents = quotes.reduce((acc, q) => acc + q.platformFeeCents, 0);

    const eligiblePayablesCents = payouts
      .filter((p) => p.status === 'ELIGIBLE')
      .reduce((acc, p) => acc + p.amountCents, 0);

    const settledPayoutsCents = payouts
      .filter((p) => p.status === 'PAID')
      .reduce((acc, p) => acc + p.amountCents, 0);

    return NextResponse.json({
      kpis: {
        creatorsCount,
        partnersCount,
        pagesCount,
        verifiedPagesCount,
        campaignsCount,
        finalEditsCount,
        assignmentsCount,
        verifiedPostsCount,
        disputesCount,
        totalGmvCents,
        editingRevenueCents,
        placementRevenueCents,
        platformFeesEarnedCents,
        eligiblePayablesCents,
        settledPayoutsCents,
      },
      recentLedger: ledgerEntries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
