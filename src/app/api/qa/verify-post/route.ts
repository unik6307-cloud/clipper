import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { payments } from '@/lib/payment-adapter';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['QUALITY_REVIEWER', 'OPERATIONS_ADMIN', 'SUPER_ADMIN']);

    const { publishedPostId, action, notes } = await req.json();

    if (!publishedPostId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'publishedPostId and action (APPROVE/REJECT) are required.' }, { status: 400 });
    }

    const post = await db.publishedPost.findUnique({
      where: { id: publishedPostId },
      include: {
        assignment: {
          include: {
            socialPage: { include: { partner: true } },
            campaign: true,
            finalEdit: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Published post record not found.' }, { status: 404 });
    }

    const isApproval = action === 'APPROVE';
    const newVerificationStatus = isApproval ? 'MANUAL_REVIEW_APPROVED' : 'REJECTED';
    const newAssignmentStatus = isApproval ? 'VERIFIED_PUBLISHED' : 'DISPUTED';

    const result = await db.$transaction(async (tx) => {
      // 1. Update published post status
      const updatedPost = await tx.publishedPost.update({
        where: { id: post.id },
        data: {
          verificationStatus: newVerificationStatus,
          verifiedByUserId: user!.userId,
          verifiedAt: new Date(),
          verificationNotes: notes || (isApproval ? 'QA verified public post URL matches approved final edit and assigned page.' : 'Rejected due to mismatch or invalid link.'),
        },
      });

      // 2. Update assignment status
      const updatedAssignment = await tx.distributionAssignment.update({
        where: { id: post.assignmentId },
        data: { status: newAssignmentStatus },
      });

      // 3. If approved, make partner payout ELIGIBLE
      if (isApproval) {
        await tx.partnerPayout.upsert({
          where: { id: `payout_${post.assignmentId}` },
          create: {
            id: `payout_${post.assignmentId}`,
            partnerId: post.assignment.socialPage.partnerId,
            assignmentId: post.assignmentId,
            amountCents: post.assignment.agreedPriceCents,
            status: 'ELIGIBLE',
          },
          update: {
            status: 'ELIGIBLE',
          },
        });

        // Record Partner Payable in Ledger
        await tx.ledgerEntry.create({
          data: {
            transactionType: 'PARTNER_PAYABLE',
            accountId: post.assignment.socialPage.partnerId,
            relatedCampaignId: post.assignment.campaignId,
            relatedAssignmentId: post.assignmentId,
            debitCents: 0,
            creditCents: post.assignment.agreedPriceCents,
            balanceCents: post.assignment.agreedPriceCents,
            notes: `Payout eligible for verified post on ${post.assignment.socialPage.handle} (Edit: ${post.assignment.finalEditId})`,
          },
        });

        // Notify creator
        await tx.notification.create({
          data: {
            userId: post.assignment.campaign.creatorId,
            title: 'Placement Verified Live!',
            message: `Your edit ${post.assignment.finalEditId} has been verified published on ${post.assignment.socialPage.handle}. Live tracking initiated.`,
            link: '/creator/placements',
            type: 'ASSIGNMENT',
          },
        });
      }

      return { updatedPost, updatedAssignment };
    });

    await logAuditEvent({
      actorUserId: user!.userId,
      actorRole: user!.role,
      action: isApproval ? 'APPROVE_PUBLICATION' : 'REJECT_PUBLICATION',
      entityType: 'published_post',
      entityId: post.id,
      newState: { status: newVerificationStatus, notes },
    });

    return NextResponse.json({
      success: true,
      message: isApproval
        ? 'Publication verified! Partner payout is now marked ELIGIBLE for settlement.'
        : 'Publication rejected with correction notes.',
      post: result.updatedPost,
      assignment: result.updatedAssignment,
    });
  } catch (error: any) {
    console.error('QA verify post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
