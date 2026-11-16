import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { finalEditId, socialPageId, agreedPriceCents } = await req.json();

    if (!finalEditId || !socialPageId) {
      return NextResponse.json(
        { error: 'finalEditId and socialPageId are required.' },
        { status: 400 }
      );
    }

    // 1. NON-NEGOTIABLE CHECK BEFORE TRANSACTION
    const existingAssignment = await db.distributionAssignment.findUnique({
      where: { finalEditId },
      include: { socialPage: true },
    });

    if (existingAssignment) {
      // Reject duplicate assignment strictly
      await logAuditEvent({
        actorUserId: user.userId,
        actorRole: user.role,
        action: 'REJECT_DUPLICATE_ASSIGNMENT_ATTEMPT',
        entityType: 'distribution_assignment',
        entityId: existingAssignment.id,
        newState: {
          attemptedEditId: finalEditId,
          attemptedPageId: socialPageId,
          existingPageId: existingAssignment.socialPageId,
          reason: 'RULE_VIOLATION: ONE_EDIT_ONE_PAGE',
        },
      });

      return NextResponse.json(
        {
          error:
            'NON_NEGOTIABLE_RULE_VIOLATION: ONE_EDIT_ONE_PAGE. This final Edit ID is already assigned and locked to social page ' +
            existingAssignment.socialPage.handle +
            '. Distributing the same edit to multiple pages is strictly forbidden.',
          code: 'ONE_EDIT_ONE_PAGE_CONFLICT',
          existingAssignmentId: existingAssignment.id,
          assignedPage: existingAssignment.socialPage.pageName,
        },
        { status: 409 }
      );
    }

    // 2. Fetch Page & Final Edit to verify validity
    const page = await db.socialPage.findUnique({
      where: { id: socialPageId },
      include: { partner: true },
    });

    if (!page || page.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Selected social page is invalid or inactive.' }, { status: 400 });
    }

    const finalEdit = await db.finalEdit.findUnique({
      where: { id: finalEditId },
      include: { campaign: true },
    });

    if (!finalEdit) {
      return NextResponse.json({ error: 'Final edit record not found.' }, { status: 404 });
    }

    // Verify creator owns the campaign
    if (
      user.role !== 'SUPER_ADMIN' &&
      finalEdit.campaign.creatorId !== user.userId
    ) {
      return NextResponse.json({ error: 'Forbidden: You do not own this campaign.' }, { status: 403 });
    }

    const priceCents = agreedPriceCents || page.placementPriceCents;

    // 3. EXECUTE TRANSACTION WITH STRICT ROW-LEVEL LOCKING
    const assignmentResult = await db.$transaction(async (tx) => {
      // Re-verify inside atomic transaction to prevent any race condition
      const checkAgain = await tx.distributionAssignment.findUnique({
        where: { finalEditId },
      });

      if (checkAgain) {
        throw new Error(
          'CONFLICT_RACE_CONDITION: Edit ID was locked by a concurrent transaction.'
        );
      }

      // Create 1-to-1 Assignment (Database schema has @unique([finalEditId]))
      const assignment = await tx.distributionAssignment.create({
        data: {
          finalEditId,
          socialPageId: page.id,
          campaignId: finalEdit.campaignId,
          partnerId: page.partnerId,
          agreedPriceCents: priceCents,
          status: 'PARTNER_INVITED',
          publishingDeadline: new Date(Date.now() + 86400000 * 5), // 5 days
          creatorApprovedAt: new Date(),
        },
      });

      // Create Partner Invitation
      const invitation = await tx.partnerInvitation.create({
        data: {
          assignmentId: assignment.id,
          socialPageId: page.id,
          partnerId: page.partnerId,
          proposedFeeCents: priceCents,
          expiresAt: new Date(Date.now() + 86400000 * 2), // 48-hour response window
          status: 'PENDING',
        },
      });

      // Update Final Edit state to ASSIGNED_LOCKED
      await tx.finalEdit.update({
        where: { id: finalEdit.id },
        data: { status: 'ASSIGNED_LOCKED' },
      });

      // Create notification for the distribution partner
      await tx.notification.create({
        data: {
          userId: page.partner.userId,
          title: 'New Publishing Assignment Invitation',
          message: `Campaign "${finalEdit.campaign.title}" invited your page ${page.handle} for a paid placement ($${(priceCents / 100).toFixed(2)}).`,
          link: '/partner/invitations',
          type: 'ASSIGNMENT',
        },
      });

      return { assignment, invitation };
    });

    // 4. Log Immutable Audit Record
    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: 'COMMIT_ASSIGNMENT',
      entityType: 'distribution_assignment',
      entityId: assignmentResult.assignment.id,
      newState: {
        rule: 'ONE_EDIT_ONE_PAGE',
        finalEditId,
        socialPageId: page.id,
        partnerId: page.partnerId,
        agreedPriceCents: priceCents,
        status: 'PARTNER_INVITED',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Edit ${finalEditId} is now officially locked to ${page.handle} and invitation has been dispatched.`,
      assignment: assignmentResult.assignment,
      invitation: assignmentResult.invitation,
    });
  } catch (error: any) {
    console.error('Error committing assignment:', error);
    if (error.code === 'P2002' || error.message?.includes('CONFLICT_RACE_CONDITION')) {
      return NextResponse.json(
        {
          error:
            'NON_NEGOTIABLE_RULE_VIOLATION: ONE_EDIT_ONE_PAGE. Duplicate assignment was blocked by database unique constraint.',
          code: 'ONE_EDIT_ONE_PAGE_CONFLICT',
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
