import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find partner profile for user
    const partner = await db.partnerProfile.findUnique({
      where: { userId: user.userId },
    });

    if (!partner && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ invitations: [] });
    }

    const whereClause: any = partner ? { partnerId: partner.id } : {};

    const invitations = await db.partnerInvitation.findMany({
      where: whereClause,
      include: {
        socialPage: true,
        assignment: {
          include: {
            campaign: {
              select: {
                id: true,
                title: true,
                objective: true,
                contentNiche: true,
                targetAudience: true,
              },
            },
            finalEdit: {
              select: {
                id: true,
                durationSeconds: true,
                aspectRatio: true,
                approvedAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invitations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invitationId, action, responseNotes } = await req.json();

    if (!invitationId || !['ACCEPT', 'DECLINE'].includes(action)) {
      return NextResponse.json({ error: 'Valid invitationId and action are required.' }, { status: 400 });
    }

    const invitation = await db.partnerInvitation.findUnique({
      where: { id: invitationId },
      include: {
        assignment: {
          include: { finalEdit: true, campaign: true, socialPage: true },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 });
    }

    const newInviteStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
    const newAssignmentStatus = action === 'ACCEPT' ? 'ASSET_ACCESS_GRANTED' : 'PARTNER_DECLINED';

    const result = await db.$transaction(async (tx) => {
      const updatedInvite = await tx.partnerInvitation.update({
        where: { id: invitation.id },
        data: {
          status: newInviteStatus,
          responseNotes: responseNotes || `Partner ${action.toLowerCase()}ed invitation.`,
        },
      });

      const updatedAssignment = await tx.distributionAssignment.update({
        where: { id: invitation.assignmentId },
        data: {
          status: newAssignmentStatus,
          partnerAcceptedAt: action === 'ACCEPT' ? new Date() : null,
        },
      });

      return { updatedInvite, updatedAssignment };
    });

    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: action === 'ACCEPT' ? 'PARTNER_ACCEPT_INVITATION' : 'PARTNER_DECLINE_INVITATION',
      entityType: 'partner_invitation',
      entityId: invitation.id,
      newState: { status: newInviteStatus, notes: responseNotes },
    });

    return NextResponse.json({
      success: true,
      message:
        action === 'ACCEPT'
          ? 'Invitation accepted! Asset download access has been granted for publication on ' +
            invitation.assignment.socialPage.handle
          : 'Invitation declined.',
      invitation: result.updatedInvite,
      assignment: result.updatedAssignment,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
